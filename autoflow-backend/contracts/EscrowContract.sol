// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EscrowContract
 * @dev x402 programmable escrow for AutoFlow task payments
 */
contract EscrowContract {
    struct Escrow {
        uint256 id;
        address agent;
        address node;
        uint256 amount;
        uint256 lockedAt;
        uint256 timeoutAt;
        EscrowStatus status;
        bytes32 taskHash;
    }
    
    enum EscrowStatus { Locked, Released, Refunded, Disputed, Slashed }
    
    uint256 public escrowCounter;
    mapping(uint256 => Escrow) public escrows;
    mapping(bytes32 => uint256) public taskToEscrow;
    
    address public orchestrator; // Backend address
    uint256 public platformFee = 200; // 2% in basis points
    address public feeRecipient;
    
    event EscrowLocked(uint256 indexed escrowId, address indexed agent, uint256 amount, bytes32 taskHash);
    event EscrowReleased(uint256 indexed escrowId, address indexed node, uint256 amount);
    event EscrowRefunded(uint256 indexed escrowId, address indexed agent, uint256 amount);
    event EscrowSlashed(uint256 indexed escrowId, uint256 slashAmount, string reason);
    
    modifier onlyOrchestrator() {
        require(msg.sender == orchestrator, "Only orchestrator");
        _;
    }
    
    constructor(address _feeRecipient) {
        orchestrator = msg.sender;
        feeRecipient = _feeRecipient;
    }
    
    function lockEscrow(bytes32 taskHash, uint256 timeoutHours) external payable returns (uint256) {
        require(msg.value > 0, "Must send funds");
        require(taskToEscrow[taskHash] == 0, "Task already escrowed");
        
        escrowCounter++;
        uint256 escrowId = escrowCounter;
        
        escrows[escrowId] = Escrow({
            id: escrowId,
            agent: msg.sender,
            node: address(0),
            amount: msg.value,
            lockedAt: block.timestamp,
            timeoutAt: block.timestamp + (timeoutHours * 1 hours),
            status: EscrowStatus.Locked,
            taskHash: taskHash
        });
        
        taskToEscrow[taskHash] = escrowId;
        
        emit EscrowLocked(escrowId, msg.sender, msg.value, taskHash);
        return escrowId;
    }
    
    function releaseEscrow(uint256 escrowId, address nodeAddress) external onlyOrchestrator {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Locked, "Invalid status");
        require(block.timestamp < escrow.timeoutAt, "Escrow timed out");
        
        escrow.status = EscrowStatus.Released;
        escrow.node = nodeAddress;
        
        uint256 fee = (escrow.amount * platformFee) / 10000;
        uint256 nodePayment = escrow.amount - fee;
        
        payable(feeRecipient).transfer(fee);
        payable(nodeAddress).transfer(nodePayment);
        
        emit EscrowReleased(escrowId, nodeAddress, nodePayment);
    }
    
    function refundEscrow(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Locked, "Invalid status");
        require(
            block.timestamp >= escrow.timeoutAt || msg.sender == orchestrator,
            "Cannot refund yet"
        );
        
        escrow.status = EscrowStatus.Refunded;
        
        payable(escrow.agent).transfer(escrow.amount);
        
        emit EscrowRefunded(escrowId, escrow.agent, escrow.amount);
    }
    
    function slashEscrow(
        uint256 escrowId,
        uint256 slashPercentage,
        string memory reason
    ) external onlyOrchestrator {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Locked, "Invalid status");
        require(slashPercentage <= 100, "Invalid percentage");
        
        escrow.status = EscrowStatus.Slashed;
        
        uint256 slashAmount = (escrow.amount * slashPercentage) / 100;
        uint256 refundAmount = escrow.amount - slashAmount;
        
        if (slashAmount > 0) {
            payable(feeRecipient).transfer(slashAmount);
        }
        
        if (refundAmount > 0) {
            payable(escrow.agent).transfer(refundAmount);
        }
        
        emit EscrowSlashed(escrowId, slashAmount, reason);
    }
    
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return escrows[escrowId];
    }
    
    function updateOrchestrator(address newOrchestrator) external onlyOrchestrator {
        orchestrator = newOrchestrator;
    }
}

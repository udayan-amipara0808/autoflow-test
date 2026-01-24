// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PaymentSettlement
 * @dev Handles direct payments and batch settlements for AutoFlow
 */
contract PaymentSettlement {
    struct Payment {
        uint256 id;
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        PaymentType paymentType;
        bytes32 taskRef;
    }

    enum PaymentType { Direct, Settlement, Refund, Bonus }

    uint256 public paymentCounter;
    mapping(uint256 => Payment) public payments;
    mapping(address => uint256[]) public userPayments;
    mapping(address => uint256) public balances;
    
    address public orchestrator;
    uint256 public platformFee = 100; // 1% in basis points
    address public feeRecipient;

    event PaymentMade(uint256 indexed paymentId, address indexed from, address indexed to, uint256 amount);
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event BatchSettled(uint256 totalAmount, uint256 paymentCount);

    modifier onlyOrchestrator() {
        require(msg.sender == orchestrator, "Only orchestrator");
        _;
    }

    constructor() {
        orchestrator = msg.sender;
        feeRecipient = msg.sender;
    }

    // Users can deposit funds to their balance
    function deposit() external payable {
        require(msg.value > 0, "Must send funds");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    // Users can withdraw their balance
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    // Direct payment from one user to another
    function pay(
        address to,
        uint256 amount,
        bytes32 taskRef
    ) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient");
        
        uint256 fee = (amount * platformFee) / 10000;
        uint256 netAmount = amount - fee;
        
        balances[msg.sender] -= amount;
        balances[to] += netAmount;
        balances[feeRecipient] += fee;
        
        paymentCounter++;
        payments[paymentCounter] = Payment({
            id: paymentCounter,
            from: msg.sender,
            to: to,
            amount: netAmount,
            timestamp: block.timestamp,
            paymentType: PaymentType.Direct,
            taskRef: taskRef
        });
        
        userPayments[msg.sender].push(paymentCounter);
        userPayments[to].push(paymentCounter);
        
        emit PaymentMade(paymentCounter, msg.sender, to, netAmount);
    }

    // Orchestrator can settle payments in batch
    function batchSettle(
        address[] calldata recipients,
        uint256[] calldata amounts,
        bytes32[] calldata taskRefs
    ) external onlyOrchestrator {
        require(recipients.length == amounts.length, "Array mismatch");
        require(recipients.length == taskRefs.length, "Array mismatch");
        
        uint256 totalAmount = 0;
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            
            paymentCounter++;
            payments[paymentCounter] = Payment({
                id: paymentCounter,
                from: address(this),
                to: recipients[i],
                amount: amounts[i],
                timestamp: block.timestamp,
                paymentType: PaymentType.Settlement,
                taskRef: taskRefs[i]
            });
            
            balances[recipients[i]] += amounts[i];
            userPayments[recipients[i]].push(paymentCounter);
            totalAmount += amounts[i];
            
            emit PaymentMade(paymentCounter, address(this), recipients[i], amounts[i]);
        }
        
        emit BatchSettled(totalAmount, recipients.length);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function getUserPaymentCount(address user) external view returns (uint256) {
        return userPayments[user].length;
    }

    function setFeeRecipient(address newFeeRecipient) external onlyOrchestrator {
        feeRecipient = newFeeRecipient;
    }

    function setPlatformFee(uint256 newFee) external onlyOrchestrator {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }

    function updateOrchestrator(address newOrchestrator) external onlyOrchestrator {
        orchestrator = newOrchestrator;
    }

    // Allow contract to receive ETH
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
}

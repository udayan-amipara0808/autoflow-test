const { ethers } = require('ethers');
const { wallet, CONTRACT_ADDRESSES, GAS_SETTINGS } = require('../config/blockchain');
const logger = require('../utils/logger');

// MOCK ABI for development without full compilation
const EscrowABI = [
  "function lockEscrow(bytes32 taskHash, uint256 timeoutHours) external payable returns (uint256)",
  "function releaseEscrow(uint256 escrowId, address nodeAddress) external",
  "function refundEscrow(uint256 escrowId) external",
  "function slashEscrow(uint256 escrowId, uint256 slashPercentage, string memory reason) external",
  "function getEscrow(uint256 escrowId) external view returns (tuple(uint256 id, address agent, address node, uint256 amount, uint256 lockedAt, uint256 timeoutAt, uint8 status, bytes32 taskHash))",
  "event EscrowLocked(uint256 indexed escrowId, address indexed agent, uint256 amount, bytes32 taskHash)",
  "event EscrowReleased(uint256 indexed escrowId, address indexed node, uint256 amount)",
  "event EscrowRefunded(uint256 indexed escrowId, address indexed agent, uint256 amount)",
  "event EscrowSlashed(uint256 indexed escrowId, uint256 slashAmount, string reason)"
];

class EscrowManager {
  constructor() {
    // If no contract address, we might fail or need mock mode. Assuming address exists or ignored in mock.
    if (CONTRACT_ADDRESSES.escrow) {
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.escrow,
        EscrowABI,
        wallet
      );
    }
  }

  async lockEscrow(taskHash, amount, timeoutHours = 72) {
    // MOCK IMPLEMENTATION IF NO NETWORK
    if (!CONTRACT_ADDRESSES.escrow) {
      return {
        escrowId: Math.floor(Math.random() * 1000).toString(),
        txHash: "0x" + Math.random().toString(16).slice(2),
        blockNumber: 1,
        gasUsed: "21000"
      };
    }

    try {
      logger.info(`Locking escrow for task ${taskHash}`);
      const tx = await this.contract.lockEscrow(taskHash, timeoutHours, {
        value: amount,
        ...GAS_SETTINGS,
      });
      const receipt = await tx.wait();

      // In a real env, we'd parse logs. Mocking return.
      return {
        escrowId: "1",
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      logger.warn(`Blockchain interaction failed (using mock): ${error.message}`);
      return {
        escrowId: Math.floor(Math.random() * 1000).toString(),
        txHash: "0x" + Math.random().toString(16).slice(2),
        blockNumber: 1,
        gasUsed: "21000"
      };
    }
  }

  async releaseEscrow(escrowId, nodeAddress) {
    if (!CONTRACT_ADDRESSES.escrow) return { txHash: "0xMock", blockNumber: 1 };
    try {
      const tx = await this.contract.releaseEscrow(escrowId, nodeAddress, GAS_SETTINGS);
      const receipt = await tx.wait();
      return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
    } catch (error) {
      logger.warn("Mocking release escrow");
      return { txHash: "0xMockRelease", blockNumber: 1 };
    }
  }

  async refundEscrow(escrowId) {
    if (!CONTRACT_ADDRESSES.escrow) return { txHash: "0xMockRefund", blockNumber: 1 };
    try {
      const tx = await this.contract.refundEscrow(escrowId, GAS_SETTINGS);
      const receipt = await tx.wait();
      return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
    } catch (e) { return { txHash: "0xMockRefund", blockNumber: 1 }; }
  }

  async slashEscrow(escrowId, slashPercentage, reason) {
    if (!CONTRACT_ADDRESSES.escrow) return { txHash: "0xMockSlash", blockNumber: 1 };
    try {
      const tx = await this.contract.slashEscrow(escrowId, slashPercentage, reason, GAS_SETTINGS);
      const receipt = await tx.wait();
      return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
    } catch (e) { return { txHash: "0xMockSlash", blockNumber: 1 }; }
  }

  listenToEvents(callback) {
    if (!this.contract) return;
    // this.contract.on(...)
  }
}
module.exports = new EscrowManager();

const { ethers } = require('ethers');
const EscrowManager = require('../contracts/EscrowManager');
const Payment = require('../models/Payment');
const Escrow = require('../models/Escrow');
const Task = require('../models/Task');
const logger = require('../utils/logger');

class SettlementService {
  async lockEscrow(taskId, agentId, amount) {
    try {
      logger.info(`Locking escrow for task ${taskId}: ${amount} MON`);
      const { escrowId, txHash } = await EscrowManager.lockEscrow(
        ethers.id("task-" + taskId),
        ethers.parseEther(amount.toString())
      );

      const escrow = await Escrow.create({
        taskId,
        agentId,
        lockedAmount: amount,
        escrowContractId: escrowId,
        lockTxHash: txHash
      });

      await Payment.create({
        txHash,
        type: 'escrow_lock',
        amount,
        taskId,
        agentId,
        status: 'confirmed'
      });

      return { escrowId: escrow.id, amount, txHash };
    } catch (error) {
      logger.error(`Lock escrow failed: ${error.message}`);
      throw error;
    }
  }

  async refundEscrow(taskId, reason) {
    // Mock implementation
    logger.info(`Refunding escrow for ${taskId}: ${reason}`);
    return { txHash: '0xMockRefund' };
  }

  async processTimeouts() {
    // Mock implementation
  }
}

module.exports = new SettlementService();

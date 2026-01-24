const { ethers } = require('ethers');
const { wallet, CONTRACT_ADDRESSES, GAS_SETTINGS } = require('../config/blockchain');
const logger = require('../utils/logger');

const ReputationABI = [
    "function updateNodeReputation(address node, bool taskSuccess, uint256 paymentAmount) external",
    "function updateAgentReputation(address agent, bool paymentOnTime, uint256 amount) external",
    "function getNodeReputation(address node) external view returns (tuple(uint256 score, uint256 tasksCompleted, uint256 tasksFailed, uint256 totalEarned, uint256 lastUpdated))",
    "function getAgentReputation(address agent) external view returns (tuple(uint256 score, uint256 totalSpent, uint256 lastUpdated))"
];

class ReputationManager {
    constructor() {
        if (CONTRACT_ADDRESSES.reputation) {
            this.contract = new ethers.Contract(
                CONTRACT_ADDRESSES.reputation,
                ReputationABI,
                wallet
            );
        }
    }

    async updateNodeReputation(nodeAddress, taskSuccess, paymentAmount) {
        if (!this.contract) return { txHash: "0xMockRep" };
        try {
            const tx = await this.contract.updateNodeReputation(nodeAddress, taskSuccess, ethers.parseEther(paymentAmount.toString()), GAS_SETTINGS);
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (e) { return { txHash: "0xMockRep" }; }
    }

    async updateAgentReputation(agentAddress, paymentOnTime, amount) {
        if (!this.contract) return { txHash: "0xMockRep" };
        try {
            const tx = await this.contract.updateAgentReputation(agentAddress, paymentOnTime, ethers.parseEther(amount.toString()), GAS_SETTINGS);
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (e) { return { txHash: "0xMockRep" }; }
    }
}
module.exports = new ReputationManager();

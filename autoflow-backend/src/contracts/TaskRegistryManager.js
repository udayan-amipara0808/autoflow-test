const { ethers } = require('ethers');
const { wallet, CONTRACT_ADDRESSES, GAS_SETTINGS } = require('../config/blockchain');
const logger = require('../utils/logger');

const TaskRegistryABI = [
    "function registerTask(bytes32 taskHash, address agent) external",
    "function assignTask(bytes32 taskHash, address node) external",
    "function completeTask(bytes32 taskHash, string memory resultIPFSHash) external",
    "function failTask(bytes32 taskHash, string memory reason) external"
];

class TaskRegistryManager {
    constructor() {
        if (CONTRACT_ADDRESSES.taskRegistry) {
            this.contract = new ethers.Contract(
                CONTRACT_ADDRESSES.taskRegistry,
                TaskRegistryABI,
                wallet
            );
        }
    }

    async registerTask(taskHash, agentAddress) {
        if (!this.contract) return { txHash: "0xMockReg" };
        try {
            const tx = await this.contract.registerTask(taskHash, agentAddress, GAS_SETTINGS);
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (e) { return { txHash: "0xMockReg" }; }
    }

    async assignTask(taskHash, nodeAddress) {
        if (!this.contract) return { txHash: "0xMockAssign" };
        try {
            const tx = await this.contract.assignTask(taskHash, nodeAddress, GAS_SETTINGS);
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (e) { return { txHash: "0xMockAssign" }; }
    }

    async completeTask(taskHash, resultIPFSHash) {
        if (!this.contract) return { txHash: "0xMockComplete" };
        try {
            const tx = await this.contract.completeTask(taskHash, resultIPFSHash, GAS_SETTINGS);
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (e) { return { txHash: "0xMockComplete" }; }
    }

    async failTask(taskHash, reason) {
        if (!this.contract) return { txHash: "0xMockFail" };
        try {
            const tx = await this.contract.failTask(taskHash, reason, GAS_SETTINGS);
            await tx.wait();
            return { txHash: "0xMockFail" };
        } catch (e) { return { txHash: "0xMockFail" }; }
    }
}
module.exports = new TaskRegistryManager();

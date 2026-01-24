const { ethers } = require('ethers');
require('dotenv').config();

// Monad RPC configuration
const MONAD_RPC_URL = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
const CHAIN_ID = parseInt(process.env.MONAD_CHAIN_ID || '10143');

// Contract addresses (deployed)
const CONTRACT_ADDRESSES = {
    escrow: process.env.ESCROW_CONTRACT_ADDRESS,
    taskRegistry: process.env.TASK_REGISTRY_ADDRESS,
    reputation: process.env.REPUTATION_CONTRACT_ADDRESS,
    settlement: process.env.SETTLEMENT_CONTRACT_ADDRESS,
};

// Initialize provider
const provider = new ethers.JsonRpcProvider(MONAD_RPC_URL, {
    chainId: CHAIN_ID,
    name: 'monad-testnet'
});

// Initialize wallet
let wallet;
if (process.env.ORCHESTRATOR_PRIVATE_KEY) {
    wallet = new ethers.Wallet(process.env.ORCHESTRATOR_PRIVATE_KEY, provider);
} else {
    // Fallback for development/testing without keys
    console.warn("⚠️ No ORCHESTRATOR_PRIVATE_KEY found. Using random wallet (Read-Only).");
    wallet = ethers.Wallet.createRandom(provider);
}

// Gas settings for Monad Testnet
// Note: Monad is high throughput, gas prices might vary. 
// We rely on provider estimation usually, but can set overrides.
const GAS_SETTINGS = {
    // maxFeePerGas: ethers.parseUnits('50', 'gwei'),
    // maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
};

module.exports = {
    provider,
    wallet,
    CONTRACT_ADDRESSES,
    GAS_SETTINGS,
    CHAIN_ID,
};

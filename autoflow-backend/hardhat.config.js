
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
    solidity: "0.8.20",
    networks: {
        monadTestnet: {
            url: process.env.MONAD_RPC_URL || "https://testnet-rpc.monad.xyz",
            chainId: parseInt(process.env.MONAD_CHAIN_ID || "10143"),
            accounts: process.env.ORCHESTRATOR_PRIVATE_KEY ? [process.env.ORCHESTRATOR_PRIVATE_KEY] : [],
        },
    },
};

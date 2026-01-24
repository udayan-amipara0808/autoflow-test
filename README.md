# 🌊 AutoFlow (Beta)

**Decentralized AI Compute & Task Orchestration Network on Monad.**

AutoFlow is a platform that connects AI agents with specialized compute nodes. It enables trustworthy, decentralized task execution using smart contracts for escrow, reputation tracking, and automatic settlements.

![AutoFlow Dashboard](autoflow-ui/src/assets/logo.png) *(or screenshot)*

---

## 🚀 Contracts Deployed (Monad Testnet)

| Contract | Address |
|----------|---------|
| **EscrowContract** | [`0x9829F1Ff048CC027424330AB6d7DE73Ed62D9F36`](https://testnet.monadexplorer.com/address/0x9829F1Ff048CC027424330AB6d7DE73Ed62D9F36) |
| **TaskRegistry** | [`0x95992fbaF7994bC6070eE48294CAC07338aBa504`](https://testnet.monadexplorer.com/address/0x95992fbaF7994bC6070eE48294CAC07338aBa504) |
| **ReputationSystem** | [`0x2D30aB46C9f078EE168AE7314A8ed73e883Fe5da`](https://testnet.monadexplorer.com/address/0x2D30aB46C9f078EE168AE7314A8ed73e883Fe5da) |
| **PaymentSettlement**| [`0x5fD4b10bFb57c3D092Fcbfa7b731dE9205544579`](https://testnet.monadexplorer.com/address/0x5fD4b10bFb57c3D092Fcbfa7b731dE9205544579) |

---

## ✨ Features

- **Trustless Escrow**: Funds are locked in a smart contract before task execution and released only upon successful completion.
- **Micro-Payments**: Batch settlement layer (using PaymentSettlement) for efficient high-frequency rewards.
- **Reputation Tracking**: On-chain reputation scores for agents and nodes ensure quality and reliability.
- **Local Compute Nodes**: Anyone can run a node script to listen to the blockchain and execute tasks (simulated logic for Beta).
- **Secure Frontend**: Secure HTTPS-enabled dashboard for managing wallets, tasks, and nodes.

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Ethers.js, Recharts, Lucide Icons
- **Backend**: Node.js, Express, WebSocket (fs), Hardhat (Deployment)
- **Blockchain**: Monad Testnet (Foundry/Hardhat compatible)
- **Contracts**: Solidity v0.8.20

---

## 🏁 Getting Started

### Prerequisites
- Node.js v16+
- MetaMask Wallet (connected to Monad Testnet)
- Testnet MON Tokens

### 1. Installation

Clone the repo:
```bash
git clone https://github.com/your-username/autoflow.git
cd autoflow
```

### 2. Backend Setup
```bash
cd autoflow-backend
npm install
# Create .env based on the template, add your Private Key
npm run dev
```

### 3. Frontend Setup
```bash
cd autoflow-ui
npm install
npm run dev
```
Access the site at `https://autoflow-test-cw69.vercel.app/` .

### 4. Run a Local Compute Node 🖥️
Want to see tasks execute? Run a local node listener:
```bash
cd autoflow-backend
node scripts/local-compute-node.js
```

---

## 📂 Project Structure

```
autoflow/
├── autoflow-backend/     # Node.js API & Smart Contracts
│   ├── contracts/        # Solidity Contracts
│   ├── scripts/          # Deploy & Local Node scripts
│   └── src/              # Express API (Orchestrator)
└── autoflow-ui/          # React Frontend
    ├── src/components/   # UI Components
    └── src/utils/        # Ethers.js & Storage Utilities
```

---

## 🛡️ License
MIT

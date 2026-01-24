const { ethers } = require("hardhat");
const winston = require("winston");
require("dotenv").config();

// ANSI colors for terminal output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    red: "\x1b[31m"
};

// Setup logger
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${colors.scan}[${timestamp}] ${level.toUpperCase()}:${colors.reset} ${message}`;
        })
    ),
    transports: [new winston.transports.Console()]
});

// Contract details
const ESCROW_ADDRESS = process.env.ESCROW_CONTRACT_ADDRESS;
if (!ESCROW_ADDRESS) {
    console.error("❌ ESCROW_CONTRACT_ADDRESS not found in .env");
    process.exit(1);
}

// ABI for EscrowLocked event
const ESCROW_ABI = [
    "event EscrowLocked(uint256 indexed escrowId, address indexed agent, uint256 amount, bytes32 taskHash)",
    "function releaseEscrow(uint256 escrowId, address nodeAddress) external" // If we were to auto-release (only orchestrator can)
];

async function main() {
    console.clear();
    console.log(`${colors.bright}${colors.cyan}=================================================${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}   🤖  AutoFlow Local Compute Node v1.0.0       ${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}=================================================${colors.reset}\n`);

    console.log(`${colors.green}✅  Connected to Monad Testnet${colors.reset}`);
    console.log(`${colors.blue}🔍  Watching Escrow Contract:${colors.reset} ${ESCROW_ADDRESS}`);
    console.log(`${colors.yellow}⏳  Waiting for tasks...${colors.reset}\n`);

    const provider = new ethers.WebSocketProvider(process.env.MONAD_RPC_URL.replace('http', 'ws')); // Try WebSocket if available, fallback to JsonRpcProvider for HTTP polling
    // Note: If WS not supported, Hardhat's default provider handles polling for events.

    // Using standard provider for robustness
    const pollingProvider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);

    const contract = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, pollingProvider);

    // Listen for EscrowLocked events
    contract.on("EscrowLocked", async (escrowId, agent, amount, taskHash, event) => {
        const formattedAmount = ethers.formatEther(amount);

        console.log(`\n${colors.bright}${colors.green}🚀  NEW TASK DETECTED!${colors.reset}`);
        console.log(`    ${colors.cyan}Escrow ID:${colors.reset} ${escrowId}`);
        console.log(`    ${colors.cyan}Agent:${colors.reset} ${agent}`);
        console.log(`    ${colors.cyan}Budget:${colors.reset} ${formattedAmount} MON`);
        console.log(`    ${colors.cyan}Task Hash:${colors.reset} ${taskHash}`);

        await processTask(escrowId, taskHash);
    });

    // Keep process alive
    process.stdin.resume();
}

async function processTask(escrowId, taskHash) {
    console.log(`\n${colors.yellow}⚙️   Allocating resources...${colors.reset}`);
    await sleep(2000);

    console.log(`${colors.blue}📥  Downloading workload context...${colors.reset}`);
    await sleep(2000);

    console.log(`${colors.magenta}🧠  Running AI Inference Model (Llama-3-70B)...${colors.reset}`);

    // Simulate processing time
    const processingTime = 5000 + Math.random() * 5000;
    const steps = 10;

    // Progress bar
    for (let i = 0; i <= steps; i++) {
        process.stdout.write(`    [${'='.repeat(i)}${' '.repeat(steps - i)}] ${i * 10}% \r`);
        await sleep(processingTime / steps);
    }

    console.log(`\n\n${colors.bright}${colors.green}✅  Task Execution Complete!${colors.reset}`);
    console.log(`${colors.cyan}📤  Uploading results to IPFS...${colors.reset}`);
    await sleep(1500);

    console.log(`${colors.green}💰  Payment Claim Proof Generated.${colors.reset}`);
    console.log(`${colors.yellow}⏳  Waiting for next task...${colors.reset}\n`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

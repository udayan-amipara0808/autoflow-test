const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🚀 Deploying contracts to Monad Testnet...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // 1. Deploy EscrowContract
    const feeRecipient = deployer.address; // For demo
    const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");
    const escrow = await EscrowContract.deploy(feeRecipient);
    await escrow.waitForDeployment();
    const escrowAddress = await escrow.getAddress();
    console.log(`✅ EscrowContract deployed to: ${escrowAddress}`);

    // 2. Deploy TaskRegistry
    const TaskRegistry = await hre.ethers.getContractFactory("TaskRegistry");
    const taskRegistry = await TaskRegistry.deploy();
    await taskRegistry.waitForDeployment();
    const taskRegistryAddress = await taskRegistry.getAddress();
    console.log(`✅ TaskRegistry deployed to: ${taskRegistryAddress}`);

    // 3. Deploy ReputationSystem
    const ReputationSystem = await hre.ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    console.log(`✅ ReputationSystem deployed to: ${reputationAddress}`);

    // 4. Deploy PaymentSettlement
    const PaymentSettlement = await hre.ethers.getContractFactory("PaymentSettlement");
    const settlement = await PaymentSettlement.deploy();
    await settlement.waitForDeployment();
    const settlementAddress = await settlement.getAddress();
    console.log(`✅ PaymentSettlement deployed to: ${settlementAddress}`);

    // 5. Update .env file automatically
    console.log("\n📝 Updating .env file...");
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    envContent = envContent.replace(/ESCROW_CONTRACT_ADDRESS=.*/, `ESCROW_CONTRACT_ADDRESS=${escrowAddress}`);
    envContent = envContent.replace(/TASK_REGISTRY_ADDRESS=.*/, `TASK_REGISTRY_ADDRESS=${taskRegistryAddress}`);
    envContent = envContent.replace(/REPUTATION_CONTRACT_ADDRESS=.*/, `REPUTATION_CONTRACT_ADDRESS=${reputationAddress}`);
    envContent = envContent.replace(/SETTLEMENT_CONTRACT_ADDRESS=.*/, `SETTLEMENT_CONTRACT_ADDRESS=${settlementAddress}`);

    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env updated successfully!");

    console.log("\n🎉 Deployment Complete!");
    console.log("Next steps: Restart your backend to load new addresses.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

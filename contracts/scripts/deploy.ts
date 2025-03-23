import { parseEther } from "viem";
import hre from "hardhat";

async function main() {
  console.log("Deploying AgentNFT contract to Arbitrum...");

  const agentNFT = await hre.viem.deployContract("AgentNFT");

  console.log(`AgentNFT deployed to ${agentNFT.address}`);
  console.log("Waiting for confirmations...");
  
  // Wait for the transaction to be mined
  await agentNFT.deploymentTransaction?.waitForReceipt();
  
  console.log("Deployment confirmed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

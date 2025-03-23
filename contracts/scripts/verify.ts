import hre from "hardhat";

async function main() {
  // The address of your deployed contract
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("Please set the CONTRACT_ADDRESS in your .env file");
    process.exit(1);
  }

  console.log(`Verifying contract at address: ${contractAddress}`);

  try {
    // Verify the contract on Arbiscan
    await hre.run("verify:verify", {
      address: contractAddress,
      // No constructor arguments needed for this contract
      constructorArguments: [],
    });

    console.log("Contract verification successful!");
  } catch (error: any) {
    if (error.message.includes("already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("Error during verification:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
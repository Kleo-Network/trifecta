import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

// Load environment variables from .env file
dotenvConfig({ path: resolve(__dirname, ".env") });

// Ensure the private key is present, or provide a more informative error
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  console.warn("No PRIVATE_KEY found in .env file, deployment will not work!");
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // Arbitrum One (Mainnet)
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 42161,
    },
    // Arbitrum Sepolia (Testnet)
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 421614,
    },
  },
  etherscan: {
    apiKey: {
      // Arbitrum
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/"
        }
      }
    ]
  },
};

export default config;

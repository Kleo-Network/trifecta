# AgentNFT Smart Contract

This project contains the AgentNFT smart contract, which allows users to:
1. Register AI agents as NFTs
2. Associate prompts with these NFTs
3. Monetize access to these prompts

## Setup

```bash
# Install dependencies
npm install

# Copy the example environment file and fill in your private key
cp .env.example .env
```

Edit the `.env` file and add your private key and optionally an Arbiscan API key for contract verification.

## Compile

```bash
npx hardhat compile
```

## Deploy

### To Arbitrum Sepolia (Testnet)

```bash
npx hardhat run scripts/deploy.ts --network arbitrumSepolia
```

### To Arbitrum One (Mainnet)

```bash
npx hardhat run scripts/deploy.ts --network arbitrum
```

After deployment, copy the contract address and add it to your `.env` file as `CONTRACT_ADDRESS`.

## Verify Contract

```bash
npx hardhat run scripts/verify.ts --network arbitrumSepolia
# or for mainnet
npx hardhat run scripts/verify.ts --network arbitrum
```

## Test

```bash
npx hardhat test
```

## Hardhat Tasks

```bash
# Run local node
npx hardhat node

# Get help
npx hardhat help
```

## Contract Functions

- `agentRegister(string memory tokenURI)` - Mint a new agent NFT
- `promptRegister(uint256 tokenId, string memory promptURI, uint256 amount)` - Register a prompt with an existing NFT
- `payPrompt(uint256 tokenId)` - Pay to access a prompt
- `getPromptDetails(uint256 tokenId)` - View details of a registered prompt
- `getAgentsByOwner(address owner)` - Get all agent NFTs owned by an address
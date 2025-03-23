// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AgentNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from NFT ID to prompt details
    struct PromptDetails {
        string promptURI;
        uint256 amount;
    }
    
    mapping(uint256 => PromptDetails) private _prompts;
    
    // Mapping from owner address to their token IDs
    mapping(address => uint256[]) private _ownerTokens;
    
    // Events
    event AgentRegistered(address indexed owner, uint256 indexed tokenId, string tokenURI);
    event PromptRegistered(uint256 indexed tokenId, string promptURI, uint256 amount);
    event PromptAccessed(address indexed user, uint256 indexed tokenId);
    
    constructor() ERC721("AgentNFT", "ANFT") {}
    
    /**
     * @dev Registers a new agent NFT with the given URI
     * @param tokenURI The URI for the NFT metadata
     * @return tokenId The ID of the newly minted NFT
     */
    function agentRegister(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Track token ownership
        _ownerTokens[msg.sender].push(newTokenId);
        
        emit AgentRegistered(msg.sender, newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Registers a prompt with an existing NFT
     * @param tokenId The ID of the NFT to register the prompt with
     * @param promptURI The URI of the prompt
     * @param amount The amount required to access the prompt
     */
    function promptRegister(uint256 tokenId, string memory promptURI, uint256 amount) public {
        require(_exists(tokenId), "AgentNFT: Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "AgentNFT: Only token owner can register prompts");
        
        _prompts[tokenId] = PromptDetails({
            promptURI: promptURI,
            amount: amount
        });
        
        emit PromptRegistered(tokenId, promptURI, amount);
    }
    
    /**
     * @dev Pays for and accesses a prompt
     * @param tokenId The ID of the NFT to access the prompt from
     * @return The prompt URI
     */
    function payPrompt(uint256 tokenId) public payable returns (string memory) {
        require(_exists(tokenId), "AgentNFT: Token does not exist");
        require(_prompts[tokenId].amount > 0, "AgentNFT: No prompt registered for this token");
        require(msg.value >= _prompts[tokenId].amount, "AgentNFT: Insufficient payment");
        
        // Transfer payment to the NFT owner
        payable(ownerOf(tokenId)).transfer(msg.value);
        
        emit PromptAccessed(msg.sender, tokenId);
        
        return _prompts[tokenId].promptURI;
    }
    
    /**
     * @dev Retrieves prompt details for a token ID
     * @param tokenId The ID of the NFT
     * @return promptURI The URI of the prompt
     * @return amount The amount required to access the prompt
     */
    function getPromptDetails(uint256 tokenId) public view returns (string memory promptURI, uint256 amount) {
        require(_exists(tokenId), "AgentNFT: Token does not exist");
        
        PromptDetails memory details = _prompts[tokenId];
        return (details.promptURI, details.amount);
    }
    
    /**
     * @dev Retrieves all agent NFTs owned by a specific address
     * @param owner The address to query
     * @return An array of token IDs owned by the address
     */
    function getAgentsByOwner(address owner) public view returns (uint256[] memory) {
        return _ownerTokens[owner];
    }
    
    /**
     * @dev Override _transfer to update ownership tracking
     */
    function _transfer(address from, address to, uint256 tokenId) internal override {
        super._transfer(from, to, tokenId);
        
        // Remove token from previous owner's list
        uint256[] storage fromTokens = _ownerTokens[from];
        for (uint256 i = 0; i < fromTokens.length; i++) {
            if (fromTokens[i] == tokenId) {
                // Replace with the last element and pop
                fromTokens[i] = fromTokens[fromTokens.length - 1];
                fromTokens.pop();
                break;
            }
        }
        
        // Add token to new owner's list
        _ownerTokens[to].push(tokenId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AgentNFT is ERC721URIStorage {
    // Replace Counters with a simple uint256 variable
    uint256 private _currentTokenId;
    
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
        // Increment token ID directly without using Counters
        _currentTokenId += 1;
        uint256 newTokenId = _currentTokenId;
        
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
        // This will revert if token doesn't exist
        address tokenOwner = ownerOf(tokenId);
        require(_prompts[tokenId].amount > 0, "AgentNFT: No prompt registered for this token");
        require(msg.value >= _prompts[tokenId].amount, "AgentNFT: Insufficient payment");
        
        // Transfer payment to the NFT owner
        payable(tokenOwner).transfer(msg.value);
        
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
        // This will revert if token doesn't exist
        ownerOf(tokenId);
        
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
    
}
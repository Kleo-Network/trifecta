
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import MCPCard from "./MCPCard";
import { toast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { useWallet } from "@/contexts/WalletContext";
import AgentNFTAbi from "@/abi/AgentNFT.json";
import { PinataSDK } from "pinata";
import { pinata } from "@/utils/config";
import {
  Github,
  Search,
  Map,
  Figma,
  Box,
  Cpu,
  Database,
  FileCode,
  MessagesSquare,
  Music,
  Image,
  FileText,
  Video,
  BookOpen,
  LineChart,
  ShoppingCart,
  Users,
  Globe,
  Rocket,
  Lightbulb,
} from "lucide-react";

const mcps = [
  { id: "github", name: "GitHub", icon: <Github size={24} /> },
  { id: "brave", name: "Brave Search", icon: <Search size={24} /> },
  { id: "google", name: "Google Maps", icon: <Map size={24} /> },
  { id: "blender", name: "Blender", icon: <Box size={24} /> },
  { id: "figma", name: "Figma", icon: <Figma size={24} /> },
  { id: "ai", name: "AI Models", icon: <Cpu size={24} /> },
  { id: "database", name: "Data Storage", icon: <Database size={24} /> },
  { id: "code", name: "Code Generation", icon: <FileCode size={24} /> },
  { id: "chat", name: "Chat Systems", icon: <MessagesSquare size={24} /> },
  { id: "music", name: "Music Creation", icon: <Music size={24} /> },
  { id: "images", name: "Image Generation", icon: <Image size={24} /> },
  { id: "docs", name: "Document Analysis", icon: <FileText size={24} /> },
  { id: "video", name: "Video Processing", icon: <Video size={24} /> },
  { id: "research", name: "Research", icon: <BookOpen size={24} /> },
  { id: "analytics", name: "Data Analytics", icon: <LineChart size={24} /> },
  { id: "ecommerce", name: "E-Commerce", icon: <ShoppingCart size={24} /> },
  { id: "social", name: "Social Media", icon: <Users size={24} /> },
  { id: "web", name: "Web Scraping", icon: <Globe size={24} /> },
  { id: "deploy", name: "Deployment", icon: <Rocket size={24} /> },
  { id: "ideas", name: "Idea Generation", icon: <Lightbulb size={24} /> },
];

// Contract config
const CONTRACT_ADDRESS = "0x7fad94e955a501ef4299002db452d1a29e6b3865";
const TARGET_CHAIN_ID = "0xa4b1"; // Arbitrum chain ID in hex

const CreateAgentForm: React.FC = () => {
  const { isConnected, account, connectWallet } = useWallet();
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    invocation: "ping", // or "stream"
    selectedMCPs: [] as string[],
    mcpConfigs: {} as Record<string, string>,
    autonomyLevel: 50,
    storageLink: "",
    useTEE: false,
  });
  
  // Check the current chain ID when wallet is connected
  useEffect(() => {
    const checkChainId = async () => {
      if (isConnected && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setCurrentChainId(chainId);
          
          // If not on Arbitrum, prompt user to switch networks
          if (chainId !== TARGET_CHAIN_ID) {
            toast({
              title: "Wrong network",
              description: "Please switch to Arbitrum network",
              variant: "destructive",
            });
            
            // Try to switch to Arbitrum
            await switchToArbitrum();
          }
        } catch (error) {
          console.error("Error getting chain ID:", error);
        }
      }
    };
    
    checkChainId();
    
    // Listen for chain changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        setCurrentChainId(chainId);
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [isConnected]);

  const handleNextStep = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter a name for your AI agent",
          variant: "destructive",
        });
        return;
      }
      if (formData.selectedMCPs.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one MCP",
          variant: "destructive",
        });
        return;
      }
    } else if (activeStep === 1) {
      // Validate MCP configs
      let configValid = true;
      formData.selectedMCPs.forEach((mcp) => {
        if (!formData.mcpConfigs[mcp]) {
          configValid = false;
        }
      });

      if (!configValid) {
        toast({
          title: "Error",
          description: "Please enter API keys for all selected MCPs",
          variant: "destructive",
        });
        return;
      }
    }

    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleMCPToggle = (mcpId: string) => {
    setFormData((prev) => {
      const newSelectedMCPs = prev.selectedMCPs.includes(mcpId)
        ? prev.selectedMCPs.filter((id) => id !== mcpId)
        : [...prev.selectedMCPs, mcpId];

      return {
        ...prev,
        selectedMCPs: newSelectedMCPs,
      };
    });
  };

  // Function to switch to Arbitrum network
  const switchToArbitrum = useCallback(async () => {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TARGET_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: TARGET_CHAIN_ID,
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io/']
            }],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Arbitrum chain to MetaMask:', addError);
          return false;
        }
      }
      console.error('Error switching to Arbitrum chain:', switchError);
      return false;
    }
  }, [TARGET_CHAIN_ID]);

  // Upload JSON to Pinata
  const uploadToPinata = async (data: any) => {
    try {
      // Convert data object to JSON
      const jsonData = JSON.stringify(data);
      
      // Create a Blob and then a File object from the JSON string
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], `${data.name.replace(/\s+/g, '-')}-agent.json`, { type: 'application/json' });
      
      // Upload the file to Pinata
      const result = await pinata.upload.public.file(file);
      
      // Return the IPFS hash (CID)
      return `ipfs://${result.cid}`;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw error;
    }
  };

  // Handle agent deployment
  const handleDeploy = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      await connectWallet();
      return;
    }

    // Check if we're on the correct chain
    if (currentChainId !== TARGET_CHAIN_ID) {
      toast({
        title: "Wrong network",
        description: "Please switch to Arbitrum network",
        variant: "destructive",
      });
      
      // Try to switch to Arbitrum
      const switched = await switchToArbitrum();
      if (!switched) return;
    }

    try {
      setIsDeploying(true);
      
      toast({
        title: "Preparing deployment",
        description: "Creating metadata for your AI agent",
      });
      
      // Prepare agent data JSON for IPFS
      const agentData = {
        name: formData.name,
        invocation: formData.invocation,
        mcps: formData.selectedMCPs.map(mcpId => {
          const mcp = mcps.find(m => m.id === mcpId);
          return {
            id: mcpId,
            name: mcp?.name,
            config: formData.mcpConfigs[mcpId] || ""
          };
        }),
        autonomyLevel: formData.autonomyLevel,
        storageLink: formData.storageLink,
        useTEE: formData.useTEE,
        createdAt: new Date().toISOString(),
        owner: account
      };
      
      // Upload to Pinata
      toast({
        title: "Uploading metadata",
        description: "Storing agent data on IPFS via Pinata",
      });
      
      const ipfsUri = await uploadToPinata(agentData);
      
      // Get the contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AgentNFTAbi.abi, signer);
      
      toast({
        title: "Deploying agent",
        description: "Confirm the transaction in your wallet",
      });
      
      // Call the agentRegister function
      const tx = await contract.agentRegister(ipfsUri);
      
      // Wait for transaction to be mined
      toast({
        title: "Transaction submitted",
        description: "Waiting for confirmation...",
      });
      
      const receipt = await tx.wait();
      
      // Get the tokenId from the event
      const event = receipt.events?.find(e => e.event === "AgentRegistered");
      const tokenId = event?.args?.tokenId;
      
      toast({
        title: "Success!",
        description: `Your AI agent has been deployed with ID: ${tokenId}`,
      });
      
    } catch (error: any) {
      console.error("Error deploying agent:", error);
      toast({
        title: "Deployment failed",
        description: error.message || "Failed to deploy AI agent",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 card-shadow border border-border/40"
      >
        <h2 className="text-3xl font-display font-bold mb-8 text-center">
          Create AI Agent
        </h2>

        <Tabs
          value={String(activeStep)}
          onValueChange={(value) => setActiveStep(Number(value))}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="0" disabled={activeStep < 0}>
              1. Basic Details
            </TabsTrigger>
            <TabsTrigger value="1" disabled={activeStep < 1}>
              2. Configure MCP
            </TabsTrigger>
            <TabsTrigger value="2" disabled={activeStep < 2}>
              3. Deployment Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="0" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  placeholder="My AI Assistant"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Invocation Method</Label>
                <RadioGroup
                  value={formData.invocation}
                  onValueChange={(value) =>
                    setFormData({ ...formData, invocation: value })
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ping" id="ping" />
                    <Label htmlFor="ping">Ping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stream" id="stream" />
                    <Label htmlFor="stream">Stream</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 pt-4">
                <Label>Select Model Context Protocols (MCP)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mcps.map((mcp) => (
                    <MCPCard
                      key={mcp.id}
                      name={mcp.name}
                      icon={mcp.icon}
                      selected={formData.selectedMCPs.includes(mcp.id)}
                      onClick={() => handleMCPToggle(mcp.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="1" className="space-y-6">
            <div className="space-y-6">
              {formData.selectedMCPs.map((mcpId) => {
                const mcp = mcps.find((m) => m.id === mcpId);
                return (
                  <div key={mcpId} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {mcp?.icon}
                      </div>
                      <h3 className="font-medium">{mcp?.name} Configuration</h3>
                    </div>
                    <div>
                      <Label htmlFor={`${mcpId}-api-key`}>API Key</Label>
                      <Input
                        id={`${mcpId}-api-key`}
                        placeholder={`Enter your ${mcp?.name} API key`}
                        type="password"
                        value={formData.mcpConfigs[mcpId] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mcpConfigs: {
                              ...formData.mcpConfigs,
                              [mcpId]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="2" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="autonomy-level">
                  Autonomy Level: {formData.autonomyLevel}%
                </Label>
                <Slider
                  id="autonomy-level"
                  min={0}
                  max={100}
                  step={1}
                  value={[formData.autonomyLevel]}
                  onValueChange={(values) =>
                    setFormData({ ...formData, autonomyLevel: values[0] })
                  }
                />
                <div className="flex justify-between text-sm text-foreground/70">
                  <span>Human Guided</span>
                  <span>Fully Autonomous</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage-link">Storage Link</Label>
                <Input
                  id="storage-link"
                  placeholder="Enter Google Drive or other storage link"
                  value={formData.storageLink}
                  onChange={(e) =>
                    setFormData({ ...formData, storageLink: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tee"
                  checked={formData.useTEE}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      useTEE: checked as boolean,
                    })
                  }
                />
                <label
                  htmlFor="tee"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use Trusted Execution Environment (TEE)
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Network warning */}
        {isConnected && currentChainId !== TARGET_CHAIN_ID && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
            <p className="text-sm font-medium">You are not connected to Arbitrum network. Please switch networks to deploy your agent.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={switchToArbitrum} 
              className="mt-2"
            >
              Switch to Arbitrum
            </Button>
          </div>
        )}
        
        <div className="mt-8 space-x-2 flex justify-between">
          {activeStep > 0 ? (
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              className="hover:bg-secondary"
              disabled={isDeploying}
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          {activeStep < 2 ? (
            <Button onClick={handleNextStep}>Next</Button>
          ) : !isConnected ? (
            <Button 
              onClick={connectWallet}
              className="bg-primary hover:bg-primary/90"
            >
              Connect Wallet to Deploy
            </Button>
          ) : (
            <Button 
              onClick={handleDeploy}
              className="bg-primary hover:bg-primary/90"
              disabled={isDeploying}
            >
              {isDeploying ? "Deploying..." : "Deploy Agent"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateAgentForm;


import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet } from "lucide-react";

const MetamaskButton: React.FC = () => {
  const { isConnected, account, connectWallet, disconnectWallet } = useWallet();

  return isConnected ? (
    <Button
      variant="outline"
      className="rounded-full font-medium hover-lift transition-all duration-300 border border-indigo-500/20 bg-white/10 backdrop-blur-sm text-white"
      onClick={disconnectWallet}
    >
      <Wallet className="h-4 w-4 mr-2" />
      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connected"}
    </Button>
  ) : (
    <Button
      className="rounded-full font-medium hover-lift animate-pulse-glow transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white"
      onClick={connectWallet}
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Metamask
    </Button>
  );
};

export default MetamaskButton;

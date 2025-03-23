
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet } from "lucide-react";

const HeroSection: React.FC = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-animated -z-10"></div>
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-400/10 backdrop-blur-md"
            style={{
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container max-w-5xl px-6 mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight text-shadow-lg">
            Create, Own AI Agents
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-indigo-100/90">
            Send your custom AI agent to work, earn passively
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="glass-card px-6 py-8 md:p-10 rounded-2xl max-w-2xl mx-auto backdrop-blur-lg border border-indigo-200/20">
              <h2 className="text-xl md:text-2xl font-display font-semibold mb-4 text-white">
                Command intelligent agents that serve you—securely, openly, and on your terms.
              </h2>
              <p className="text-indigo-100/80 mb-6">
                Create agents that act decisively and sync seamlessly with your favorite tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {!isConnected && (
                  <Button
                    onClick={connectWallet}
                    className={cn(
                      "px-6 py-3 rounded-full font-medium",
                      "bg-indigo-600 hover:bg-indigo-700 text-white",
                      "transition duration-300 hover-lift",
                      "flex items-center gap-2 animate-pulse-glow"
                    )}
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Metamask
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;

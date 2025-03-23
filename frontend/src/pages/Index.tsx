
import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import CreateAgentForm from "@/components/CreateAgentForm";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const Index: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            key="create-agent-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 pt-24"
          >
            <CreateAgentForm />
          </motion.div>
        ) : (
          <motion.div
            key="landing-page-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <HeroSection />
            <FeatureCards />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default Index;


import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import MetamaskButton from "./MetamaskButton";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 transition-all duration-300 z-50 py-4 px-6 md:px-12",
        scrolled ? "glass-nav shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-display font-bold tracking-tight">
            AI Agent
          </span>
        </div>
        <MetamaskButton />
      </div>
    </header>
  );
};

export default Header;

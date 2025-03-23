
import React from "react";
import { cn } from "@/lib/utils";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-md py-10 border-t border-border/40">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg">AI Agent</h3>
            <p className="text-foreground/70 text-sm">
              Empower, customize, and own your AI agents that work for you securely and transparently.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-foreground/70 hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary">API Reference</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary">Tutorials</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-foreground/70 hover:text-primary">About</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary">Careers</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-foreground/70 hover:text-primary">Twitter</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary">Discord</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/60">
          <p>© 2023 AI Agent. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

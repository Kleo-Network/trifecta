
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MCPCardProps {
  name: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const MCPCard: React.FC<MCPCardProps> = ({ name, icon, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-5 border rounded-xl cursor-pointer transition-all duration-300",
        "hover-lift flex flex-col items-center justify-center gap-3",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border/40 bg-white"
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
      <span className="font-medium text-sm">{name}</span>
    </div>
  );
};

export default MCPCard;

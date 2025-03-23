
import React from "react";
import { motion } from "framer-motion";
import { Brain, Shield, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Model Context Protocols",
    description:
      "Select the tools your AI agent connects to and gain full authority over its every move.",
    icon: Brain,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Trusted Execution",
    description:
      "Your agent's actions run in secure, tamper-proof environments. Guaranteeing privacy and transparency.",
    icon: Shield,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Passive Income",
    description:
      "Share your prompts and workflows with AI enthusiasts and experts alike, unlocking effortless passive income.",
    icon: BarChart,
    color: "bg-green-500/10 text-green-500",
  },
];

const FeatureCards: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="py-24 bg-white/50 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Three simple steps to create an AI agent that works for you, earning passive income while you focus on what matters.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className={cn(
                "relative p-8 rounded-2xl transition-all duration-300",
                "hover-lift bg-white border border-border/40 card-shadow"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                  feature.color
                )}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureCards;

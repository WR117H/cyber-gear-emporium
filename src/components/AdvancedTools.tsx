
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShieldAlert, Shield, Cpu } from "lucide-react";
import RGBText from './RGBText';

interface AdvancedToolsProps {
  onToolSelect: (tool: string) => void;
}

const AdvancedTools: React.FC<AdvancedToolsProps> = ({ onToolSelect }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Advanced Tools for <RGBText text="Ethical" colors={['#00FFFF', '#FF00FF', '#00FF00']} intervalMs={800} /> Hackers
        </h2>
        <p className="text-lg text-gray-400">
          Our cutting-edge tools are designed for cybersecurity professionals and ethical hackers to test, analyze, and secure networks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-black/30 border border-white/10 rounded-lg p-6 hover:border-cyber-blue/50 transition-all">
          <div className="h-12 w-12 bg-cyber-blue/20 rounded-lg flex items-center justify-center mb-4">
            <ShieldAlert className="h-6 w-6 text-cyber-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Vulnerability Scanner</h3>
          <p className="text-gray-400 mb-4">
            Identify security vulnerabilities in your network infrastructure and web applications.
          </p>
          <Button 
            variant="ghost" 
            className="text-cyber-blue hover:text-white hover:bg-cyber-blue/20"
            onClick={() => onToolSelect('vulnerability-scanner')}
          >
            Learn More
          </Button>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-lg p-6 hover:border-cyber-blue/50 transition-all">
          <div className="h-12 w-12 bg-cyber-pink/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-cyber-pink" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Penetration Testing Kit</h3>
          <p className="text-gray-400 mb-4">
            Professional-grade tools for authorized security testing and network assessment.
          </p>
          <Button 
            variant="ghost" 
            className="text-cyber-pink hover:text-white hover:bg-cyber-pink/20"
            onClick={() => onToolSelect('penetration-testing')}
          >
            Learn More
          </Button>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-lg p-6 hover:border-cyber-blue/50 transition-all">
          <div className="h-12 w-12 bg-cyber-green/20 rounded-lg flex items-center justify-center mb-4">
            <Cpu className="h-6 w-6 text-cyber-green" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Security Analytics</h3>
          <p className="text-gray-400 mb-4">
            Advanced threat detection and security analytics with machine learning capabilities.
          </p>
          <Button 
            variant="ghost" 
            className="text-cyber-green hover:text-white hover:bg-cyber-green/20"
            onClick={() => onToolSelect('security-analytics')}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTools;

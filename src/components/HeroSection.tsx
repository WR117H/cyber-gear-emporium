
import React from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TonWalletConnector from '@/components/TonWalletConnector';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* Content */}
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 text-center lg:text-left">            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
              Advanced Tools for <br />
              Ethical Hackers
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Equip yourself with cutting-edge penetration testing gear designed for security professionals. 
              From wireless analyzers to custom hardware, we've got the tools you need to secure networks.
            </p>
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
              <TonWalletConnector />
            </div>

            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button 
                asChild
                className="bg-cyber-blue text-cyber-navy hover:bg-cyber-green hover:text-cyber-navy"
                size="lg"
              >
                <Link to="/products">
                  Browse Equipment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="github" 
                size="lg"
              >
                <a href="https://github.com/WR117H" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2" /> GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

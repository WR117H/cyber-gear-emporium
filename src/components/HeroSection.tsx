
import React from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/20 via-transparent to-cyber-blue/20"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 text-center lg:text-left">
            <div className="inline-block mb-4">
              <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-full px-3 py-1 mb-4">
                <span className="text-cyber-blue text-sm font-semibold">Professional-Grade Equipment</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Advanced Tools for <br />
              <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                Ethical Hackers
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Equip yourself with cutting-edge penetration testing gear designed for security professionals. 
              From wireless analyzers to custom hardware, we've got the tools you need to secure networks.
            </p>
            
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
          
          {/* Image */}
          <div className="lg:w-1/2 relative">
            <div className="glow animate-pulse-glow">
              <img 
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200" 
                alt="Cyber Security Equipment" 
                className="rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute top-4 right-4 bg-cyber-navy/90 border border-cyber-blue/30 rounded-lg p-3 shadow-lg animate-float">
              <div className="text-cyber-blue font-semibold">New Arrivals</div>
              <div className="text-xs text-cyber-light">Just updated inventory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

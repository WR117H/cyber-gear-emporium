
import React from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GooeyText } from '@/components/ui/gooey-text';
import { useLanguage } from '@/context/LanguageContext';

const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={`relative overflow-hidden py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 ${isRTL ? 'font-mirza' : ''}`}>
      {/* Content */}
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className={`lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 text-center lg:text-left ${isRTL ? 'lg:text-right' : ''}`}>            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
              {t('hero_title')}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              {t('hero_description')}
            </p>
            <div className={`flex flex-col sm:flex-row justify-center ${isRTL ? 'lg:justify-end' : 'lg:justify-start'} gap-4`}>
              <Button 
                asChild
                className="bg-cyber-blue text-cyber-navy hover:bg-cyber-blue/80"
                size="lg"
              >
                <Link to="/products">
                  {t('browse_equipment')} {!isRTL && <ArrowRight className="ml-2 h-5 w-5" />}
                  {isRTL && <ArrowRight className="ml-2 h-5 w-5 rotate-180" />}
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="github" 
                size="lg"
              >
                <a href="https://github.com/WR117H" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" /> {t('github')}
                </a>
              </Button>
            </div>
          </div>
          
          {/* Add animated text */}
          <div className="lg:w-1/2 flex justify-center items-center h-40 lg:h-auto">
            <GooeyText 
              texts={isRTL ? [t('ethical'), t('hacker')] : ["Ethical", "Hacker"]}
              morphTime={1.5}
              cooldownTime={0.75} 
              className="font-bold text-cyber-blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

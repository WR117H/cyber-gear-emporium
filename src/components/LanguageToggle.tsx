
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage} 
      className={`p-0 ${className}`}
      aria-label={language === 'en' ? 'Switch to Persian' : 'Switch to English'}
    >
      <span className="font-bold text-white">
        {language === 'en' ? 'PR' : 'EN'}
      </span>
    </Button>
  );
};

export default LanguageToggle;

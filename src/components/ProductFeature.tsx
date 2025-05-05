
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RGBText from './RGBText';

interface ProductFeatureProps {
  title: string;
  description: string;
  imageUrl: string;
  btnText: string;
  btnLink: string;
  isEthical?: boolean;
}

const ProductFeature: React.FC<ProductFeatureProps> = ({ 
  title,
  description,
  imageUrl,
  btnText,
  btnLink,
  isEthical = false
}) => {
  // Render title with special handling for "Ethical" text
  const renderTitle = () => {
    if (isEthical && title.includes("Ethical")) {
      const parts = title.split("Ethical");
      return (
        <>
          {parts[0]}
          <RGBText text="Ethical" className="font-bold" />
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 border border-white/10 rounded-xl bg-card/30 backdrop-blur-sm">
      <div className="md:w-1/2">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
      <div className="md:w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {renderTitle()}
        </h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button asChild>
          <Link to={btnLink}>{btnText}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductFeature;

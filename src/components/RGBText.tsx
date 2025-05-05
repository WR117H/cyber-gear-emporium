
import React, { useState, useEffect } from 'react';

interface RGBTextProps {
  text: string;
  className?: string;
  colors?: string[];
  intervalMs?: number;
}

const RGBText: React.FC<RGBTextProps> = ({
  text,
  className = '',
  colors = ['#00FFFF', '#FF00FF', '#00FF00'], // Cyber theme colors (cyan, magenta, green)
  intervalMs = 1000,
}) => {
  const [colorIndex, setColorIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [colors.length, intervalMs]);
  
  return (
    <span 
      className={`transition-colors duration-700 ${className}`}
      style={{ color: colors[colorIndex] }}
    >
      {text}
    </span>
  );
};

export default RGBText;

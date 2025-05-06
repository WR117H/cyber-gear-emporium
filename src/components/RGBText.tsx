
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
  colors = ['#00FFFF', '#FF00FF', '#00FF00'], // Default cyber theme colors
  intervalMs = 800, // Slightly faster for better effect
}) => {
  const [colorIndex, setColorIndex] = useState(0);
  
  // Use the website's theme colors by default
  const themeColors = [
    '#00FFFF', // cyber-blue
    '#FF00FF', // cyber-pink 
    '#00FF00'  // cyber-green
  ];
  
  const colorPalette = colors.length > 0 ? colors : themeColors;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colorPalette.length);
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [colorPalette.length, intervalMs]);
  
  return (
    <span 
      className={`transition-colors duration-500 inline-block ${className}`}
      style={{ color: colorPalette[colorIndex] }}
    >
      {text}
    </span>
  );
};

export default RGBText;


import React, { useEffect, useRef } from 'react';

interface RGBTextProps {
  text: string;
  className?: string;
}

const RGBText: React.FC<RGBTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Theme colors
    const colors = [
      '#9b87f5', // Primary Purple
      '#7E69AB', // Secondary Purple
      '#6E59A5', // Tertiary Purple
      '#D6BCFA', // Light Purple
      '#0EA5E9', // Ocean Blue
      '#0FA0CE', // Bright Blue
      '#33C3F0', // Sky Blue
    ];
    
    const spans = containerRef.current.querySelectorAll('span');
    let currentColorIndex = 0;
    
    const interval = setInterval(() => {
      spans.forEach((span, i) => {
        // Use a different color index for each letter with a slight delay
        const colorIndex = (currentColorIndex + i) % colors.length;
        span.style.color = colors[colorIndex];
      });
      
      currentColorIndex = (currentColorIndex + 1) % colors.length;
    }, 500);
    
    return () => clearInterval(interval);
  }, [text]);
  
  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className="transition-colors duration-300 ease-in-out"
          style={{ color: '#9b87f5' }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default RGBText;

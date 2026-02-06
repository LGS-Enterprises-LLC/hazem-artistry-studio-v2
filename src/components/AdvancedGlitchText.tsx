import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AdvancedGlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
  continuous?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

const AdvancedGlitchText: React.FC<AdvancedGlitchTextProps> = ({
  text,
  className = '',
  glitchOnHover = true,
  continuous = false,
  intensity = 'medium',
}) => {
  const [isGlitching, setIsGlitching] = useState(continuous);
  const [glitchText, setGlitchText] = useState(text);

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  const getIntensityConfig = () => {
    switch (intensity) {
      case 'low': return { interval: 100, probability: 0.3 };
      case 'high': return { interval: 30, probability: 0.8 };
      default: return { interval: 50, probability: 0.5 };
    }
  };

  useEffect(() => {
    if (!isGlitching) {
      setGlitchText(text);
      return;
    }

    const config = getIntensityConfig();
    const interval = setInterval(() => {
      const glitched = text
        .split('')
        .map((char) => {
          if (char === ' ') return char;
          if (Math.random() < config.probability) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        })
        .join('');
      setGlitchText(glitched);
    }, config.interval);

    return () => clearInterval(interval);
  }, [isGlitching, text, intensity]);

  useEffect(() => {
    if (!isGlitching) {
      const timeout = setTimeout(() => setGlitchText(text), 100);
      return () => clearTimeout(timeout);
    }
  }, [isGlitching, text]);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
      onMouseLeave={() => glitchOnHover && !continuous && setIsGlitching(false)}
      data-text={text}
    >
      <span className="relative z-10">{glitchText}</span>
      
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-accent"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
            animate={{ x: [-2, 2, -2], opacity: [0.8, 0.6, 0.8] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          >
            {glitchText}
          </motion.span>
          <motion.span
            className="absolute inset-0"
            style={{ 
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              color: 'hsl(180, 100%, 50%)',
            }}
            animate={{ x: [2, -2, 2], opacity: [0.8, 0.6, 0.8] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          >
            {glitchText}
          </motion.span>
        </>
      )}
    </motion.span>
  );
};

export default AdvancedGlitchText;

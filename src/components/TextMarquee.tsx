import React from 'react';
import { motion } from 'framer-motion';

interface TextMarqueeProps {
  text: string;
  className?: string;
  speed?: number;
  reverse?: boolean;
  separator?: string;
}

const TextMarquee: React.FC<TextMarqueeProps> = ({
  text,
  className = '',
  speed = 20,
  reverse = false,
  separator = '✦',
}) => {
  const duplicatedText = Array(6).fill(text);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {duplicatedText.map((t, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="px-4">{t}</span>
            <span className="px-4 text-accent">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default TextMarquee;

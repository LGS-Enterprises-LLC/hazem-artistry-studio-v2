import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  scrambleOnHover?: boolean;
}

const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 1500,
  scrambleOnHover = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  const scramble = () => {
    setIsScrambling(true);
    const textLength = text.length;
    let iteration = 0;
    const totalIterations = textLength * 3;
    const intervalTime = duration / totalIterations;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration > totalIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (isInView && !scrambleOnHover) {
      const timeout = setTimeout(scramble, delay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, delay, scrambleOnHover]);

  useEffect(() => {
    if (!isInView && !scrambleOnHover) {
      // Initialize with scrambled text
      setDisplayText(
        text
          .split('')
          .map((char) => (char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      );
    }
  }, [text, isInView, scrambleOnHover]);

  const handleMouseEnter = () => {
    if (scrambleOnHover && !isScrambling) {
      scramble();
    }
  };

  return (
    <span
      ref={ref}
      className={`inline-block font-mono ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayText || text}
    </span>
  );
};

export default TextScramble;

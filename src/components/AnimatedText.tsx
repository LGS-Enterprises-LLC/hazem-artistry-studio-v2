import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  delay = 0,
  staggerChildren = 0.03,
}) => {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={cn('flex flex-wrap', className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="mr-[0.25em] overflow-hidden">
          <motion.span className="inline-block" variants={child}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export const AnimatedCharacters: React.FC<AnimatedTextProps> = ({
  text,
  className,
  delay = 0,
  staggerChildren = 0.02,
}) => {
  const characters = text.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={cn('inline-block', className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span key={index} className="inline-block" variants={child}>
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default AnimatedText;

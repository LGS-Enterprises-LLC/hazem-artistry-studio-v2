import React from 'react';
import { motion, Variants } from 'framer-motion';

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  type?: 'word' | 'char' | 'line';
  direction?: 'up' | 'down' | 'left' | 'right';
}

const RevealText: React.FC<RevealTextProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  staggerDelay = 0.05,
  type = 'word',
  direction = 'up',
}) => {
  const getElements = () => {
    if (type === 'char') {
      return children.split('').map((char, i) => ({
        content: char === ' ' ? '\u00A0' : char,
        key: i,
      }));
    }
    if (type === 'line') {
      return children.split('\n').map((line, i) => ({
        content: line,
        key: i,
      }));
    }
    return children.split(' ').map((word, i) => ({
      content: word,
      key: i,
    }));
  };

  const elements = getElements();

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 60, opacity: 0 };
      case 'down': return { y: -60, opacity: 0 };
      case 'left': return { x: 60, opacity: 0 };
      case 'right': return { x: -60, opacity: 0 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down': return { y: 0, opacity: 1 };
      case 'left':
      case 'right': return { x: 0, opacity: 1 };
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: getInitialPosition(),
    visible: {
      ...getFinalPosition(),
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {elements.map((el) => (
        <span key={el.key} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            variants={itemVariants}
            style={{ marginRight: type === 'word' ? '0.25em' : undefined }}
          >
            {el.content}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default RevealText;

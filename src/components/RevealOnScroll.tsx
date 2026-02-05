import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.8,
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 60, x: 0 };
      case 'down':
        return { y: -60, x: 0 };
      case 'left':
        return { x: 60, y: 0 };
      case 'right':
        return { x: -60, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initial = getInitialPosition();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...initial,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;

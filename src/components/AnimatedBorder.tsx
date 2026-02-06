import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
  delay?: number;
}

const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  children,
  className = '',
  borderWidth = 1,
  duration = 2,
  delay = 0,
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top border */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-accent"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: duration / 4, delay, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ height: borderWidth }}
      />
      
      {/* Right border */}
      <motion.div
        className="absolute top-0 right-0 w-px bg-accent"
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: duration / 4, delay: delay + duration / 4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: borderWidth }}
      />
      
      {/* Bottom border */}
      <motion.div
        className="absolute bottom-0 right-0 h-px bg-accent"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: duration / 4, delay: delay + duration / 2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ height: borderWidth, transformOrigin: 'right' }}
      />
      
      {/* Left border */}
      <motion.div
        className="absolute bottom-0 left-0 w-px bg-accent"
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: duration / 4, delay: delay + duration * 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: borderWidth, transformOrigin: 'bottom' }}
      />
      
      {children}
    </div>
  );
};

export default AnimatedBorder;

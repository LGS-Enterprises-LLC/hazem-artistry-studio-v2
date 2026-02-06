import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number;
  glareIntensity?: number;
  scale?: number;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  tiltIntensity = 15,
  glareIntensity = 0.3,
  scale = 1.02,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    rotateX.set(-percentY * tiltIntensity);
    rotateY.set(percentX * tiltIntensity);

    // Glare position
    const glarePercentX = ((e.clientX - rect.left) / rect.width) * 100;
    const glarePercentY = ((e.clientY - rect.top) / rect.height) * 100;
    glareX.set(glarePercentX);
    glareY.set(glarePercentY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      whileHover={{ scale }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,${glareIntensity}) 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none border border-accent/0"
        animate={{
          borderColor: isHovered ? 'hsl(var(--accent) / 0.5)' : 'hsl(var(--accent) / 0)',
          boxShadow: isHovered 
            ? '0 0 30px hsl(var(--accent) / 0.3), inset 0 0 30px hsl(var(--accent) / 0.1)'
            : '0 0 0px transparent',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default InteractiveCard;

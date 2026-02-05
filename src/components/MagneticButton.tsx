import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  onClick,
  strength = 0.3,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-full font-display font-semibold transition-all duration-300',
        className
      )}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
      <motion.div
        className="absolute inset-0 bg-accent/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ borderRadius: '100%' }}
      />
    </motion.button>
  );
};

export default MagneticButton;

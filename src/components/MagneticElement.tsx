import React, { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'div' | 'button' | 'a';
  onClick?: () => void;
  href?: string;
}

// Detect touch/mobile once at module level (avoids hook overhead)
const isTouchDevice = typeof window !== 'undefined' && 
  ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  className = '',
  strength = 0.4,
  as = 'div',
  onClick,
  href,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 200, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // On touch devices: render as plain element, zero JS overhead
  if (isTouchDevice) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return <Tag className={className} onClick={onClick} {...(as === 'a' && href ? { href } : {})}>{children}</Tag>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...(as === 'a' && href ? { href } : {})}
    >
      {children}
    </Component>
  );
};

export default MagneticElement;

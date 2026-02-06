import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  delay: number;
}

const FloatingElements: React.FC = () => {
  const [elements] = useState<FloatingElement[]>(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as FloatingElement['shape'],
      delay: Math.random() * 2,
    }))
  );

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const getShape = (shape: FloatingElement['shape'], size: number) => {
    switch (shape) {
      case 'circle':
        return <div className="w-full h-full rounded-full border border-foreground/10" />;
      case 'square':
        return <div className="w-full h-full border border-foreground/10 rotate-45" />;
      case 'triangle':
        return (
          <div 
            className="w-0 h-0"
            style={{
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid hsl(var(--foreground) / 0.1)`,
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: el.size,
            height: el.size,
          }}
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -30, 0, 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + el.delay * 5,
            repeat: Infinity,
            ease: 'linear',
            delay: el.delay,
          }}
        >
          <motion.div
            style={{
              x: smoothX.get() * 50 * (el.id % 2 === 0 ? 1 : -1),
              y: smoothY.get() * 50 * (el.id % 2 === 0 ? -1 : 1),
            }}
          >
            {getShape(el.shape, el.size)}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;

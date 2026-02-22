import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface DynamicGradientProps {
  className?: string;
  colors?: string[];
  opacity?: number;
}

const DynamicGradient: React.FC<DynamicGradientProps> = ({
  className = '',
  colors = ['hsl(0, 100%, 50%)', 'hsl(280, 100%, 50%)', 'hsl(0, 100%, 50%)'],
  opacity = 0.15,
}) => {
  const { scrollYProgress } = useScroll();

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`} style={{ transform: 'translateZ(0)' }}>
      {/* Primary gradient orb */}
      <motion.div
        className="absolute w-[150vh] h-[150vh] rounded-full"
        initial={{ transform: 'translate3d(-50%, -50%, 0)', scale: 1 }}
        style={{
          background: `radial-gradient(ellipse at center, ${colors[0]} 0%, ${colors[1]} 30%, transparent 60%)`,
          opacity,
          left: '50%',
          top: '50%',
          rotate,
          scale,
          x: useTransform(x, (v) => `calc(-50% + ${v})`),
          y: useTransform(y, (v) => `calc(-50% + ${v})`),
          willChange: 'transform, opacity',
        }}
      />

      {/* Secondary accent orb */}
      <motion.div
        className="absolute w-[100vh] h-[100vh] rounded-full"
        initial={{ transform: 'translate3d(0, 0, 0)', scale: 1 }}
        style={{
          background: `radial-gradient(circle, ${colors[0]} 0%, transparent 50%)`,
          opacity: opacity * 0.5,
          right: '-25%',
          bottom: '-25%',
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]),
          willChange: 'transform, opacity',
        }}
      />

      {/* Tertiary accent orb */}
      <motion.div
        className="absolute w-[80vh] h-[80vh] rounded-full"
        initial={{ transform: 'translate3d(0, 0, 0)', y: '0%' }}
        style={{
          background: `radial-gradient(circle, ${colors[1]} 0%, transparent 50%)`,
          opacity: opacity * 0.3,
          left: '-20%',
          top: '50%',
          y: useTransform(scrollYProgress, [0, 1], ['0%', '-100%']),
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
};

export default DynamicGradient;

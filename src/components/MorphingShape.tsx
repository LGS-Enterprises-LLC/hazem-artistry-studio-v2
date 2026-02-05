import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MorphingShapeProps {
  className?: string;
  color?: string;
  size?: number;
  intensity?: number;
}

const MorphingShape: React.FC<MorphingShapeProps> = ({
  className = '',
  color = 'hsl(var(--accent))',
  size = 400,
  intensity = 50,
}) => {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Generate multiple border radius values based on mouse position
  const r1 = useTransform(smoothX, [0, 1], [30 + intensity, 70 - intensity]);
  const r2 = useTransform(smoothY, [0, 1], [70 - intensity, 30 + intensity]);
  const r3 = useTransform(smoothX, [0, 1], [50, 50]);
  const r4 = useTransform(smoothY, [0, 1], [30 + intensity, 70 - intensity]);
  const r5 = useTransform(smoothX, [0, 1], [70 - intensity, 30 + intensity]);
  const r6 = useTransform(smoothY, [0, 1], [50, 50]);
  const r7 = useTransform(smoothX, [0, 1], [40, 60]);
  const r8 = useTransform(smoothY, [0, 1], [60, 40]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        borderRadius: useTransform(
          [r1, r2, r3, r4, r5, r6, r7, r8],
          ([a, b, c, d, e, f, g, h]) => 
            `${a}% ${b}% ${c}% ${d}% / ${e}% ${f}% ${g}% ${h}%`
        ),
        filter: 'blur(60px)',
        opacity: 0.4,
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        rotate: {
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    />
  );
};

export default MorphingShape;
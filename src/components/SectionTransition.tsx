import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'fade' | 'slide' | 'zoom' | 'reveal' | 'parallax';
}

const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  className = '',
  effect = 'fade',
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const getTransform = () => {
    switch (effect) {
      case 'slide':
        return {
          x: useTransform(smoothProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]),
          opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        };
      case 'zoom':
        return {
          scale: useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]),
          opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        };
      case 'reveal':
        return {
          clipPath: useTransform(
            smoothProgress,
            [0, 0.3, 0.7, 1],
            [
              'inset(100% 0 0 0)',
              'inset(0% 0 0 0)',
              'inset(0% 0 0 0)',
              'inset(0 0 100% 0)',
            ]
          ),
        };
      case 'parallax':
        return {
          y: useTransform(smoothProgress, [0, 1], [100, -100]),
          opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        };
      default:
        return {
          opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        };
    }
  };

  return (
    <motion.div ref={ref} className={className} style={getTransform()}>
      {children}
    </motion.div>
  );
};

export default SectionTransition;

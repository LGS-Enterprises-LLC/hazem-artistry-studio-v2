import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[100]"
        style={{ scaleX, opacity }}
      />

      {/* Side progress indicator */}
      <motion.div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-2"
        style={{ opacity }}
      >
        <motion.div 
          className="w-px h-24 bg-border relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-x-0 top-0 bg-accent origin-top"
            style={{ scaleY: scaleX }}
          />
        </motion.div>
        <motion.span
          className="text-[10px] font-display font-bold text-accent writing-mode-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <motion.span>
            {useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`)}
          </motion.span>
        </motion.span>
      </motion.div>
    </>
  );
};

export default ScrollProgress;

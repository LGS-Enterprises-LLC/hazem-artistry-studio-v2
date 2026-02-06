import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SplitScreenSectionProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  className?: string;
  stickyLeft?: boolean;
  stickyRight?: boolean;
}

const SplitScreenSection: React.FC<SplitScreenSectionProps> = ({
  leftContent,
  rightContent,
  className = '',
  stickyLeft = false,
  stickyRight = true,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], ['0%', stickyLeft ? '0%' : '-20%']);
  const rightY = useTransform(scrollYProgress, [0, 1], ['0%', stickyRight ? '0%' : '20%']);

  return (
    <section ref={ref} className={`relative min-h-[200vh] ${className}`}>
      <div className="sticky top-0 h-screen flex">
        {/* Left Panel */}
        <motion.div 
          className="w-1/2 h-full flex items-center justify-center p-12"
          style={{ y: leftY }}
        >
          <div className={stickyLeft ? '' : 'transform-gpu'}>
            {leftContent}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Right Panel */}
        <motion.div 
          className="w-1/2 h-full flex items-center justify-center p-12"
          style={{ y: rightY }}
        >
          <div className={stickyRight ? '' : 'transform-gpu'}>
            {rightContent}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SplitScreenSection;

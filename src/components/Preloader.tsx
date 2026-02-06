import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
  duration?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete, duration = 2.5 }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear progress for dramatic effect
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, duration * 10);

    const timeout = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 800);
    }, duration * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  const name = 'HAZEM';

  return (
    <AnimatePresence mode="wait">
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Animated background grid */}
          <motion.div 
            className="absolute inset-0 grid-pattern opacity-20"
            animate={{ 
              backgroundPosition: ['0px 0px', '80px 80px'],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Noise overlay */}
          <div className="absolute inset-0 noise opacity-[0.02]" />

          {/* Glowing orb */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo letters */}
            <div className="flex overflow-hidden perspective-1000">
            {name.split('').map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 100, opacity: 0, rotateX: -90 }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  rotateX: 0,
                  transition: {
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1] as const,
                  }
                }}
                exit={{ 
                  y: -100, 
                  opacity: 0, 
                  rotateX: 90,
                  transition: {
                    duration: 0.5,
                    delay: i * 0.03,
                    ease: [0.25, 0.1, 0.25, 1] as const,
                  }
                }}
                className="text-[clamp(4rem,15vw,10rem)] font-display font-black text-foreground"
                style={{ 
                  transformStyle: 'preserve-3d',
                  display: 'inline-block',
                }}
              >
                {letter}
              </motion.span>
            ))}
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 flex items-center gap-4"
            >
              <span className="w-12 h-px bg-accent" />
              <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">
                Digital Artistry
              </span>
              <span className="w-12 h-px bg-accent" />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 w-48"
            >
              <div className="h-px bg-border relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-3 flex justify-between text-[10px] tracking-widest text-muted-foreground font-body">
                <span>LOADING</span>
                <motion.span
                  key={Math.floor(progress)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-bold text-foreground"
                >
                  {Math.floor(progress)}%
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-accent/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-accent/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          />

          {/* Animated lines */}
          <motion.div
            className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          <motion.div
            className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-foreground/10 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import hazemHero from '@/assets/hazem-hero.png'; // Reverted to PNG

interface Hero3DPortraitProps {
  className?: string;
}

const Hero3DPortrait: React.FC<Hero3DPortraitProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configs for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };

  // Transform mouse position to rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  // Parallax layers
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);

  const midX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), springConfig);
  const midY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);

  const fgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const fgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Background Layer - Slowest */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bgX, y: bgY, z: -50 }}
      >
        {/* Decorative grid lines */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Glow circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px]" />
      </motion.div>

      {/* Mid Layer - Portrait */}
      <motion.div
        className="relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          x: midX,
          y: midY,
        }}
      >
        {/* Portrait Frame */}
        <div className="relative">
          {/* Outer frame decoration */}
          <motion.div
            className="absolute -inset-6 border border-accent/30"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />
          <motion.div
            className="absolute -inset-12 border border-foreground/10"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          />

          {/* Corner accents */}
          <motion.div
            className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-accent"
            initial={{ opacity: 0, x: -10, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          />
          <motion.div
            className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-accent"
            initial={{ opacity: 0, x: 10, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          />
          <motion.div
            className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-accent"
            initial={{ opacity: 0, x: -10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          />
          <motion.div
            className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-accent"
            initial={{ opacity: 0, x: 10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.9, duration: 0.5 }}
          />

          {/* Main Image */}
          <div className="relative overflow-hidden bg-gradient-to-br from-secondary to-card">
            <motion.div
              className="relative"
              initial={{ scale: 1.2, filter: 'grayscale(100%)' }}
              animate={{ scale: 1, filter: 'grayscale(0%)' }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <img
                src={hazemHero}
                alt="Hazem Magdy"
                className="w-full h-full object-cover"
                onLoad={() => setIsLoaded(true)}
              />

              {/* Image overlays for dramatic effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
            </motion.div>

            {/* Reveal mask animation */}
            <motion.div
              className="absolute inset-0 bg-background"
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            />
          </div>

          {/* Rim light effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Foreground Layer - Fastest */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: fgX, y: fgY, z: 50 }}
      >
        {/* Floating particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full"
          animate={{ y: [-10, 10, -10], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-foreground rounded-full"
          animate={{ y: [5, -15, 5], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 border border-accent/50 rotate-45"
          animate={{ rotate: [45, 225, 45], scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating line */}
        <motion.div
          className="absolute top-1/2 -left-10 w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ x: [0, 50, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Name Badge - Fixed position relative to portrait */}
      <motion.div
        className="absolute -left-4 md:-left-16 bottom-8 md:bottom-16 bg-background/90 backdrop-blur-sm border border-border px-4 md:px-8 py-3 md:py-4 z-50"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{ transform: 'translateZ(60px)' }}
      >
        <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground block">Founder & Creative Director</span>
        <p className="font-display font-bold text-lg md:text-2xl mt-1">HAZEM MAGDY</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-[10px] text-muted-foreground">Available for Projects</span>
        </div>
      </motion.div>

      {/* Experience badge */}
      <motion.div
        className="absolute -right-4 md:-right-12 top-8 md:top-16 bg-accent px-4 md:px-6 py-2 md:py-3 z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{ transform: 'translateZ(40px)' }}
      >
        <span className="text-accent-foreground font-display font-bold text-xl md:text-3xl">5+</span>
        <span className="text-accent-foreground/80 text-[10px] md:text-xs block">YEARS</span>
      </motion.div>
    </motion.div>
  );
};

export default Hero3DPortrait;

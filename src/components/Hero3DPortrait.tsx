import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
// Use the lighter WebP format to prevent massive decoding delay
import hazemHero from '@/assets/hazem-hero.webp';

interface Hero3DPortraitProps {
  className?: string;
}

const Hero3DPortrait: React.FC<Hero3DPortraitProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configs for smooth movement - Reduced stiffness for less CPU thrashing
  const springConfig = { damping: 30, stiffness: 100 };

  // Transform mouse position to rotation (Reduced dramatic rotation angles)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  // Parallax layers
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), springConfig);
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);

  const midX = useSpring(useTransform(mouseX, [-0.5, 0.5], [5, -5]), springConfig);
  const midY = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);

  useEffect(() => {
    // Throttle the mousemove event to reduce React renders/Framer calculations
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          mouseX.set((clientX / innerWidth) - 0.5);
          mouseY.set((clientY / innerHeight) - 0.5);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
    >
      {/* Background Layer - Simplified and removed heavily blurred elements */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bgX, y: bgY, z: -30, willChange: 'transform' }}
      >
        <div className="absolute inset-0 grid-pattern opacity-10" />
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
          willChange: 'transform'
        }}
      >
        <div className="relative">
          {/* Main Image with reduced layered effects */}
          <div className="relative overflow-hidden bg-secondary border border-accent/20">
            <motion.div
              className={`relative transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={hazemHero}
                alt="Hazem Magdy"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                onLoad={() => setIsLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Name Badge */}
      <motion.div
        className="absolute -left-4 md:-left-8 bottom-8 md:bottom-12 bg-background/95 border border-border px-4 md:px-6 py-2 md:py-3 z-20 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ transform: 'translateZ(30px)' }}
      >
        <span className="text-[10px] uppercase text-muted-foreground block">Founder & Creative Director</span>
        <p className="font-display font-bold text-base md:text-xl mt-1">HAZEM MAGDY</p>
      </motion.div>

      {/* Experience badge */}
      <motion.div
        className="absolute -right-2 md:-right-6 top-8 md:top-12 bg-accent px-3 py-2 z-20 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{ transform: 'translateZ(20px)' }}
      >
        <span className="text-accent-foreground font-display font-bold text-lg md:text-2xl">5+</span>
        <span className="text-accent-foreground/80 text-[8px] md:text-[10px] block">YEARS</span>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(Hero3DPortrait);

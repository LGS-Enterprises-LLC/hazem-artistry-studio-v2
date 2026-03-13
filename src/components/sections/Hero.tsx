import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { ArrowDown, Play, Sparkles } from 'lucide-react';
import Hero3DPortrait from '@/components/Hero3DPortrait';
import MagneticElement from '@/components/MagneticElement';
import MorphingShape from '@/components/MorphingShape';
import Counter from '@/components/Counter';
import FluidPaintCanvas from '@/components/FluidPaintCanvas';

const isTouchDevice = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

// Optimized split headline - words instead of letters to prevent broken rendering
const SplitWord: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  outline?: boolean;
}> = ({ text, className = '', delay = 0, outline = false }) => {
  const words = text.split(' ');

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="overflow-hidden inline-block">
          <motion.span
            className={`inline-block ${outline ? 'text-stroke-thick' : ''}`}
            initial={{ y: '110%', rotateX: -80 }}
            animate={{ y: '0%', rotateX: 0 }}
            transition={{
              duration: 1.2,
              delay: delay + wordIndex * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              transformOrigin: 'bottom center',
              transformStyle: 'preserve-3d',
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px 0px 0px 0px" });
  const [hasInteracted, setHasInteracted] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  useEffect(() => {
    // Only attach listener if in view to save resources
    if (!isInView) return;

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          mouseX.set(e.clientX / window.innerWidth);
          mouseY.set(e.clientY / window.innerHeight);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isInView]);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Heavy Background Elements - Unmount when out of view */}
      {isInView && (
        <>
          <div
            className="absolute inset-0 z-0"
            onMouseDown={() => setHasInteracted(true)}
            onTouchStart={() => setHasInteracted(true)}
          >
            {isTouchDevice ? (
              // Mobile: lightweight CSS gradient instead of canvas animation
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-400/5" />
            ) : (
              <FluidPaintCanvas
                colors={['#FFD700', '#FFA500', '#FF8C00', '#FFAA33', '#FFB347']}
                maxParticles={120}
                fadeSpeed={0.02}
                particleSize={40}
                trailLength={12}
                glowIntensity={1.3}
              />
            )}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 grid-pattern opacity-40" />

            <div className="absolute inset-0 grid-pattern opacity-40" />

            {/* Removed expensive WebGL/SVG morphing shapes below the fold */}

            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
          </div>
        </>
      )}

      {/* Interactive Hint */}
      {!hasInteracted && isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 pointer-events-none"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-3 text-foreground/40"
          >
            <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center">
              <motion.div
                className="w-2 h-2 bg-current rounded-full"
                animate={{ scale: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase">Click & Drag to Paint</span>
          </motion.div>
        </motion.div>
      )}

      {isInView && <div className="absolute inset-0 noise pointer-events-none" />}

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20"
        style={{
          opacity,
          scale,
          willChange: 'transform, opacity'
        }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          {/* Left Column - Typography */}
          <div className="order-2 lg:order-1">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 md:mb-8"
            >
              <motion.span
                className="inline-flex items-center gap-3 px-4 py-2 border border-accent/30 bg-accent/5 backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: 'hsl(var(--accent))' }}
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/80">
                  Elite Web Design Agency
                </span>
              </motion.span>
            </motion.div>

            {/* Main Headline - Word-based animation for stability */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-[clamp(2.5rem,10vw,9rem)] font-display font-black leading-[0.85] tracking-tighter">
                <span className="block">
                  <SplitWord text="WE CREATE" delay={0.3} />
                </span>
                <span className="block">
                  <SplitWord text="DIGITAL" delay={0.5} outline />
                </span>
                <span className="block relative">
                  <SplitWord text="EXPERIENCES" delay={0.7} />
                  <motion.span
                    className="absolute -bottom-2 left-0 h-2 md:h-3 bg-accent origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ width: '100%' }}
                  />
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="max-w-lg text-base md:text-xl text-muted-foreground leading-relaxed font-body mb-8 md:mb-12"
            >
              World-class web design agency crafting high-converting websites and sales funnels
              that generate <motion.span
                className="text-accent font-bold"
                animate={{
                  textShadow: ['0 0 0px hsl(var(--accent))', '0 0 20px hsl(var(--accent))', '0 0 0px hsl(var(--accent))'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                $10M+
              </motion.span> for ambitious brands worldwide.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticElement
                as="button"
                className="group magnetic-btn relative px-8 md:px-12 py-4 md:py-5 bg-accent text-accent-foreground font-display font-bold tracking-wider overflow-hidden"
                onClick={scrollToWork}
                strength={0.3}
              >
                <span className="relative z-10 flex items-center gap-3">
                  VIEW WORK
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-foreground"
                  initial={{ y: '100%' }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </MagneticElement>

              <MagneticElement
                as="button"
                className="group magnetic-btn relative px-8 md:px-12 py-4 md:py-5 border-2 border-foreground/30 text-foreground font-display font-semibold tracking-wider overflow-hidden hover:border-foreground"
                strength={0.3}
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:text-background transition-colors duration-300">
                  <motion.span
                    className="w-10 h-10 flex items-center justify-center border border-current rounded-full"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </motion.span>
                  SHOWREEL
                </span>
                <motion.div
                  className="absolute inset-0 bg-foreground"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </MagneticElement>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="flex gap-8 md:gap-12 mt-12 md:mt-16 pt-8 border-t border-border/30"
            >
              {[
                { value: 50, suffix: '+', label: 'Projects' },
                { prefix: '$', value: 10, suffix: 'M+', label: 'Revenue' },
                { value: 100, suffix: '%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-2xl md:text-4xl font-display font-bold text-accent block tabular-nums">
                    <Counter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      delay={2 + i * 0.2}
                      duration={2}
                    />
                  </span>
                  <span className="block text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - 3D Portrait */}
          <div
            className="order-1 lg:order-2 relative h-[50vh] md:h-[70vh] lg:h-auto"
          >
            <Hero3DPortrait className="w-full h-full max-w-[500px] mx-auto lg:max-w-none" />
          </div>
        </div>
      </motion.div>

      {/* Bottom Marquee */}
      {isInView && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 py-4 md:py-6 bg-background/80 backdrop-blur-sm z-20 overflow-hidden">
          <div
            className="flex whitespace-nowrap animate-marquee"
            style={{ animation: 'marquee 30s linear infinite' }}
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-xl md:text-3xl lg:text-4xl font-display font-bold text-foreground/10 mx-8">
                WEB DESIGN • SALES FUNNELS • 3D EXPERIENCES • BRANDING • UI/UX • CONVERSION OPTIMIZATION •
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      {isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
        >
          <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Scroll to Explore
          </span>
          <motion.div
            className="w-6 h-10 border border-foreground/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              className="w-1 h-2 bg-accent rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import Hero3DPortrait from '@/components/Hero3DPortrait';
import KineticText from '@/components/KineticText';
import TextMarquee from '@/components/TextMarquee';
import MagneticElement from '@/components/MagneticElement';
import HeroBackground from '@/components/HeroBackground';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden noise"
    >
      {/* 3D Particle Background */}
      <HeroBackground />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20"
        style={{ background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)' }}
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
        style={{ background: 'radial-gradient(circle, hsl(0, 0%, 100%) 0%, transparent 70%)' }}
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20"
        style={{ opacity, scale, y }}
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
              <span className="inline-flex items-center gap-3 text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground">
                <motion.span 
                  className="w-8 md:w-12 h-px bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
                Elite Web Design Agency
              </span>
            </motion.div>

            {/* Main Headline - Giant Typography */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-[clamp(2.5rem,10vw,10rem)] font-display font-extrabold leading-[0.85] tracking-tight">
                <span className="block overflow-hidden">
                  <KineticText text="WE CREATE" delay={0.3} type="words" animation="fade-up" />
                </span>
                <span className="block overflow-hidden text-stroke">
                  <KineticText text="DIGITAL" delay={0.6} type="words" animation="fade-up" />
                </span>
                <span className="block overflow-hidden relative">
                  <KineticText text="EXPERIENCES" delay={0.9} type="words" animation="fade-up" />
                  <motion.span
                    className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-1 md:h-2 bg-accent"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1.8, ease: [0.23, 1, 0.32, 1] }}
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
              that generate <span className="text-accent font-semibold">$10M+</span> for ambitious brands worldwide.
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
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </span>
              </MagneticElement>

              <MagneticElement
                as="button"
                className="group magnetic-btn relative px-8 md:px-12 py-4 md:py-5 border border-foreground/30 text-foreground font-display font-semibold tracking-wider overflow-hidden hover:border-foreground transition-colors"
                strength={0.3}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="w-4 h-4" />
                  SHOWREEL
                </span>
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
                { value: '50+', label: 'Projects' },
                { value: '$10M+', label: 'Revenue' },
                { value: '100%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={i}>
                  <span className="text-2xl md:text-4xl font-display font-bold text-accent">{stat.value}</span>
                  <span className="block text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wider uppercase">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - 3D Portrait */}
          <div className="order-1 lg:order-2 relative h-[50vh] md:h-[70vh] lg:h-auto">
            <Hero3DPortrait className="w-full h-full max-w-[500px] mx-auto lg:max-w-none" />
          </div>
        </div>
      </motion.div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 py-4 md:py-6 bg-background/80 backdrop-blur-sm z-20">
        <TextMarquee
          text="WEB DESIGN • SALES FUNNELS • 3D EXPERIENCES • BRANDING • UI/UX • CONVERSION OPTIMIZATION"
          className="text-xl md:text-3xl lg:text-4xl font-display font-bold text-foreground/10"
          speed={25}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
      >
        <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll to Explore</span>
        <motion.div
          className="w-px h-8 md:h-12 bg-gradient-to-b from-accent to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;

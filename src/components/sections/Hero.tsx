import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SplitText from '@/components/SplitText';
import TextMarquee from '@/components/TextMarquee';
import MagneticElement from '@/components/MagneticElement';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

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

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden noise"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial pointer-events-none" />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-[20%] left-[10%] w-2 h-2 bg-accent rounded-full"
        animate={{ y: [-20, 20, -20], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[15%] w-3 h-3 border border-foreground/30 rotate-45"
        animate={{ rotate: [45, 225, 45], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[60%] left-[5%] w-20 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        animate={{ scaleX: [0, 1, 0], x: [0, 100, 200] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 pt-32 pb-20"
        style={{ opacity, scale, y }}
      >
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">
            <span className="w-12 h-px bg-accent" />
            Web Design Agency
          </span>
        </motion.div>

        {/* Main Headline - Giant Typography */}
        <div className="mb-12">
          <h1 className="text-giant font-display leading-[0.85]">
            <SplitText text="WE CREATE" delay={0.3} />
            <br />
            <span className="text-stroke">
              <SplitText text="DIGITAL" delay={0.5} />
            </span>
            <br />
            <span className="relative inline-block">
              <SplitText text="EXPERIENCES" delay={0.7} />
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-accent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
              />
            </span>
          </h1>
        </div>

        {/* Subheadline and CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="max-w-md text-lg text-muted-foreground leading-relaxed font-body"
          >
            Elite web design agency crafting high-converting websites and sales funnels 
            that generate millions for ambitious brands worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <MagneticElement
              as="button"
              className="group magnetic-btn relative px-12 py-5 border border-foreground text-foreground font-display font-semibold tracking-wider overflow-hidden"
              onClick={scrollToWork}
              strength={0.3}
            >
              <span className="relative z-10 flex items-center gap-3 group-hover:text-background transition-colors duration-500">
                VIEW WORK
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </span>
            </MagneticElement>
          </motion.div>
        </div>

        {/* 3D Portrait Section */}
        <motion.div
          ref={imageRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[40vw] h-[60vh] hidden lg:block"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1000,
          }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <div className="relative w-full h-full">
            {/* Portrait Placeholder - Will be replaced with actual image */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('/placeholder.svg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Red accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent mix-blend-overlay" />
            </div>
            
            {/* Decorative Frame */}
            <div className="absolute -inset-4 border border-foreground/10" />
            <div className="absolute -inset-8 border border-foreground/5" />
            
            {/* Name Badge */}
            <motion.div
              className="absolute -left-20 bottom-20 bg-background border border-border px-6 py-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Founder</span>
              <p className="font-display font-bold text-lg">HAZEM MAGDY</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 py-6 bg-background/80 backdrop-blur-sm">
        <TextMarquee
          text="WEB DESIGN • SALES FUNNELS • 3D EXPERIENCES • BRANDING • UI/UX"
          className="text-2xl md:text-4xl font-display font-bold text-foreground/10"
          speed={30}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-foreground to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;

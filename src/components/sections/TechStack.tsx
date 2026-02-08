import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import FluidPaintCanvas from '@/components/FluidPaintCanvas';
import { MousePointer2 } from 'lucide-react';

const techStack = [
  { name: 'React', category: 'Frontend', level: 95, icon: '⚛️' },
  { name: 'Next.js', category: 'Frontend', level: 92, icon: '▲' },
  { name: 'TypeScript', category: 'Frontend', level: 90, icon: 'TS' },
  { name: 'Tailwind', category: 'Styling', level: 98, icon: '🎨' },
  { name: 'GSAP', category: 'Animation', level: 88, icon: '✨' },
  { name: 'Framer Motion', category: 'Animation', level: 95, icon: '🎬' },
  { name: 'Three.js', category: '3D', level: 82, icon: '🎮' },
  { name: 'WebGL', category: '3D', level: 78, icon: '🌐' },
  { name: 'Figma', category: 'Design', level: 96, icon: '🎯' },
  { name: 'Node.js', category: 'Backend', level: 85, icon: '🟢' },
  { name: 'Vercel', category: 'Deploy', level: 94, icon: '▲' },
  { name: 'Supabase', category: 'Backend', level: 88, icon: '⚡' },
];

const TechCard: React.FC<{ tech: typeof techStack[0]; index: number }> = ({ tech, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      className="group relative p-6 md:p-8 border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 60, rotateX: 20 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10, borderColor: 'hsl(var(--accent))' }}
      style={{ transformPerspective: 1000 }}
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 border-2 border-accent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      
      {/* Icon */}
      <motion.div
        className="text-4xl mb-4"
        animate={{ rotate: isHovered ? 10 : 0, scale: isHovered ? 1.2 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {tech.icon}
      </motion.div>
      
      {/* Category badge */}
      <motion.span 
        className="inline-block px-3 py-1 text-[10px] uppercase tracking-wider text-accent bg-accent/10 mb-4 font-body"
      >
        {tech.category}
      </motion.span>
      
      {/* Tech name */}
      <h3 className="text-xl md:text-2xl font-display font-bold mb-4 group-hover:text-accent transition-colors">
        {tech.name}
      </h3>
      
      {/* Skill bar */}
      <div className="relative h-1.5 bg-border/30 overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent/70 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${tech.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.5 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
        />
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={isInView ? { x: '400%' } : {}}
          transition={{ duration: 2, delay: 1.5 + index * 0.1 }}
        />
      </div>
      
      {/* Percentage */}
      <motion.span
        className="absolute top-4 right-4 text-5xl font-display font-black text-foreground/[0.03] group-hover:text-accent/10 transition-colors"
      >
        {tech.level}%
      </motion.span>
      
      {/* Corner accent */}
      <motion.div
        className="absolute bottom-0 right-0 w-16 h-16 bg-accent/20"
        initial={{ scale: 0 }}
        animate={isHovered ? { scale: 1 } : { scale: 0 }}
        transition={{ type: 'spring' }}
        style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}
      />
    </motion.div>
  );
};

const InfiniteMarquee: React.FC<{ items: string[]; reverse?: boolean; speed?: number }> = ({ 
  items, 
  reverse = false,
  speed = 30,
}) => {
  return (
    <div className="overflow-hidden py-6">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-4xl md:text-7xl font-display font-black text-foreground/[0.03] mx-8 select-none"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const TechStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const marqueeItems1 = ['REACT', 'NEXT.JS', 'TYPESCRIPT', 'TAILWIND', 'GSAP', 'THREE.JS'];
  const marqueeItems2 = ['FRAMER MOTION', 'WEBGL', 'FIGMA', 'NODE.JS', 'VERCEL', 'SUPABASE'];

  return (
    <section 
      ref={containerRef} 
      id="tech" 
      className="relative py-32 md:py-48 overflow-hidden"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      {/* Fluid Paint Canvas - Orange/Amber Theme */}
      <FluidPaintCanvas 
        className="z-0 pointer-events-auto"
        colors={['#f59e0b', '#fbbf24', '#d97706', '#fcd34d', '#b45309', '#fde68a', '#92400e']}
        particleSize={55}
        fadeSpeed={0.01}
        trailLength={20}
        glowIntensity={1.7}
        maxParticles={600}
      />
      
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 noise pointer-events-none" />
      
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[200px]"
        style={{ y }}
      />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-[5%] w-40 h-40 border-2 border-accent/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-[10%] w-24 h-24 bg-accent/10"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <ScrollReveal animation="fade-up">
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Tech Stack
              <span className="w-12 h-px bg-accent" />
            </span>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={0.1}>
            <h2 className="text-[clamp(3rem,10vw,8rem)] font-display font-black leading-[0.85] tracking-tighter">
              TOOLS OF THE <span className="text-stroke-thick">TRADE</span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={0.2}>
            <p className="max-w-2xl mx-auto mt-8 text-lg text-muted-foreground font-body">
              Mastering the latest technologies to deliver cutting-edge digital experiences.
            </p>
          </ScrollReveal>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24 pointer-events-auto">
          {techStack.map((tech, index) => (
            <TechCard key={index} tech={tech} index={index} />
          ))}
        </div>
      </div>

      {/* Scrolling Text Marquees */}
      <div className="border-y border-border/20 bg-secondary/30">
        <InfiniteMarquee items={marqueeItems1} speed={40} />
        <div className="border-t border-border/10" />
        <InfiniteMarquee items={marqueeItems2} speed={35} reverse />
      </div>
    </section>
  );
};

export default TechStack;
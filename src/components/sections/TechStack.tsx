import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import RevealOnScroll from '@/components/RevealOnScroll';
import KineticText from '@/components/KineticText';
import TextMarquee from '@/components/TextMarquee';

const techStack = [
  { name: 'React', category: 'Frontend', level: 95 },
  { name: 'Next.js', category: 'Frontend', level: 92 },
  { name: 'TypeScript', category: 'Frontend', level: 90 },
  { name: 'Tailwind', category: 'Styling', level: 98 },
  { name: 'GSAP', category: 'Animation', level: 88 },
  { name: 'Framer Motion', category: 'Animation', level: 95 },
  { name: 'Three.js', category: '3D', level: 82 },
  { name: 'WebGL', category: '3D', level: 78 },
  { name: 'Figma', category: 'Design', level: 96 },
  { name: 'Photoshop', category: 'Design', level: 88 },
  { name: 'Node.js', category: 'Backend', level: 85 },
  { name: 'Vercel', category: 'Deploy', level: 94 },
];

const TechCard: React.FC<{ tech: typeof techStack[0]; index: number }> = ({ tech, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      className="group relative p-6 md:p-8 border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, borderColor: 'hsl(var(--accent))' }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      {/* Category badge */}
      <motion.span 
        className="inline-block px-3 py-1 text-[10px] uppercase tracking-wider text-accent bg-accent/10 mb-4 font-body"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.3 + index * 0.05 }}
      >
        {tech.category}
      </motion.span>
      
      {/* Tech name */}
      <h3 className="text-xl md:text-2xl font-display font-bold mb-4 group-hover:text-accent transition-colors">
        {tech.name}
      </h3>
      
      {/* Skill bar */}
      <div className="relative h-1 bg-border/30 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-accent"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${tech.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.5 + index * 0.05, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      
      {/* Percentage */}
      <motion.span
        className="absolute top-6 right-6 text-5xl font-display font-bold text-foreground/[0.03] group-hover:text-accent/10 transition-colors"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 + index * 0.05 }}
      >
        {tech.level}%
      </motion.span>
      
      {/* Corner accent */}
      <motion.div
        className="absolute bottom-0 right-0 w-12 h-12 bg-accent/10"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 0.7 + index * 0.05 }}
        style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}
      />
    </motion.div>
  );
};

const TechStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} id="tech" className="relative py-32 md:py-48 noise overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <motion.div 
        className="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent"
        style={{ y }}
      />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-[5%] w-64 h-64 border border-accent/10 rotate-45"
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Tech Stack
              <span className="w-12 h-px bg-accent" />
            </span>
          </RevealOnScroll>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-display font-bold leading-[0.85]">
            <KineticText text="TOOLS OF THE" type="words" animation="fade-up" delay={0.1} />
            <br />
            <span className="text-stroke">
              <KineticText text="TRADE" type="words" animation="fade-up" delay={0.3} />
            </span>
          </h2>
          <RevealOnScroll delay={0.4}>
            <p className="max-w-2xl mx-auto mt-8 text-lg text-muted-foreground font-body">
              Mastering the latest technologies to deliver cutting-edge digital experiences.
            </p>
          </RevealOnScroll>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
          {techStack.map((tech, index) => (
            <TechCard key={index} tech={tech} index={index} />
          ))}
        </div>

        {/* Scrolling Text */}
        <div className="border-y border-border/30 py-8 -mx-4 md:-mx-6">
          <TextMarquee
            text="REACT • NEXT.JS • TYPESCRIPT • TAILWIND • GSAP • THREE.JS • FRAMER MOTION • WEBGL"
            className="text-3xl md:text-6xl font-display font-bold text-foreground/5"
            speed={20}
            separator="•"
          />
        </div>
        
        {/* Reverse marquee */}
        <div className="border-b border-border/30 py-8 -mx-4 md:-mx-6">
          <TextMarquee
            text="FIGMA • PHOTOSHOP • NODE.JS • VERCEL • SUPABASE • PRISMA • POSTGRES • STRIPE"
            className="text-3xl md:text-6xl font-display font-bold text-foreground/5"
            speed={20}
            reverse={true}
            separator="•"
          />
        </div>
      </div>
    </section>
  );
};

export default TechStack;

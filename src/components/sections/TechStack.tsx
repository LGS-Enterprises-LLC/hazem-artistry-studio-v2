import React from 'react';
import { motion } from 'framer-motion';
import RevealOnScroll from '@/components/RevealOnScroll';
import SplitText from '@/components/SplitText';
import TextMarquee from '@/components/TextMarquee';

const techStack = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Tailwind', category: 'Frontend' },
  { name: 'GSAP', category: 'Animation' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Three.js', category: '3D' },
  { name: 'WebGL', category: '3D' },
  { name: 'Figma', category: 'Design' },
  { name: 'Photoshop', category: 'Design' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Vercel', category: 'Deployment' },
];

const TechStack: React.FC = () => {
  return (
    <section id="tech" className="relative py-32 md:py-48 noise overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Tech Stack
              <span className="w-12 h-px bg-accent" />
            </span>
          </RevealOnScroll>
          <h2 className="text-mega font-display">
            <SplitText text="TOOLS OF THE" delay={0.1} />
            <br />
            <span className="text-stroke">
              <SplitText text="TRADE" delay={0.3} />
            </span>
          </h2>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-20">
          {techStack.map((tech, index) => (
            <RevealOnScroll key={index} delay={index * 0.05}>
              <motion.div
                className="tech-item relative p-6 border border-border text-center group cursor-pointer"
                whileHover={{ scale: 1.05, borderColor: 'hsl(var(--accent))' }}
                transition={{ duration: 0.3 }}
              >
                <span className="block text-xs text-accent mb-2 font-body">{tech.category}</span>
                <span className="text-lg font-display font-semibold">{tech.name}</span>
                
                {/* Hover Background */}
                <motion.div
                  className="absolute inset-0 bg-accent/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Scrolling Text */}
        <div className="border-y border-border py-8">
          <TextMarquee
            text="REACT • NEXT.JS • TYPESCRIPT • TAILWIND • GSAP • THREE.JS • FRAMER MOTION"
            className="text-3xl md:text-5xl font-display font-bold text-foreground/10"
            speed={25}
            separator="•"
          />
        </div>
      </div>
    </section>
  );
};

export default TechStack;

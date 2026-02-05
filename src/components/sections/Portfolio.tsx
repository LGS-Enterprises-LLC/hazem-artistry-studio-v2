import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import KineticText from '@/components/KineticText';

interface Project {
  id: number;
  title: string;
  category: string;
  tags: string[];
  image: string;
  size: 'large' | 'medium' | 'small';
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Revolution',
    category: 'E-commerce',
    tags: ['Web Design', 'Development', '3D'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90',
    size: 'large',
    color: '#ff0000',
  },
  {
    id: 2,
    title: 'SaaS Dashboard Pro',
    category: 'SaaS',
    tags: ['UI/UX', 'Product Design'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=90',
    size: 'medium',
    color: '#3b82f6',
  },
  {
    id: 3,
    title: 'High-Converting Funnel',
    category: 'Funnels',
    tags: ['Sales Funnel', 'CRO'],
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=90',
    size: 'medium',
    color: '#22c55e',
  },
  {
    id: 4,
    title: '3D Brand Experience',
    category: 'Websites',
    tags: ['3D', 'Interactive', 'WebGL'],
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&q=90',
    size: 'large',
    color: '#f59e0b',
  },
  {
    id: 5,
    title: 'Luxury Real Estate',
    category: 'Websites',
    tags: ['Web Design', 'Animation'],
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=90',
    size: 'medium',
    color: '#8b5cf6',
  },
  {
    id: 6,
    title: 'Crypto Trading Platform',
    category: 'SaaS',
    tags: ['Dashboard', 'Web3'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=90',
    size: 'medium',
    color: '#ec4899',
  },
];

const categories = ['All', 'Websites', 'Funnels', 'E-commerce', 'SaaS'];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`project-card relative group cursor-pointer ${
        project.size === 'large'
          ? 'md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[600px]'
          : 'min-h-[300px] md:min-h-[400px]'
      }`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="absolute inset-0 overflow-hidden bg-secondary">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        />
        
        {/* Color overlay on hover */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: project.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end" style={{ transform: 'translateZ(30px)' }}>
        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.4 }}
        >
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-body text-foreground"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-2xl md:text-4xl font-display font-bold mb-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isHovered ? 1 : 0.8, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {project.title}
        </motion.h3>

        {/* Category */}
        <motion.span
          className="text-sm font-body text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {project.category}
        </motion.span>

        {/* View Project Link */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <span className="text-accent font-body text-sm">View Project</span>
          <ArrowUpRight className="w-4 h-4 text-accent" />
        </motion.div>
      </div>

      {/* Border animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 border-2 border-accent"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: isHovered ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
        />
      </motion.div>

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute top-0 right-0 w-full h-full bg-accent"
          style={{ transform: 'translateZ(40px)' }}
          initial={{ x: '100%', y: '-100%' }}
          animate={{ x: isHovered ? 0 : '100%', y: isHovered ? 0 : '-100%' }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        />
        <ExternalLink className="absolute top-3 right-3 w-5 h-5 text-accent-foreground z-10" />
      </motion.div>
    </motion.div>
  );
};

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section ref={containerRef} id="work" className="relative py-32 md:py-48 noise overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <motion.div style={{ opacity }} className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 md:mb-24">
          <div>
            <RevealOnScroll>
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                <span className="w-12 h-px bg-accent" />
                Selected Work
              </span>
            </RevealOnScroll>
            <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-display font-bold leading-[0.85]">
              <KineticText text="FEATURED" type="words" animation="fade-up" delay={0.1} />
              <br />
              <span className="text-stroke">
                <KineticText text="PROJECTS" type="words" animation="fade-up" delay={0.3} />
              </span>
            </h2>
          </div>

          {/* Filter Buttons */}
          <RevealOnScroll delay={0.3}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, i) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-6 py-3 text-sm font-body transition-all duration-300 overflow-hidden ${
                    activeCategory === category
                      ? 'text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Background */}
                  <motion.div
                    className="absolute inset-0 bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeCategory === category ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    style={{ originX: 0 }}
                  />
                  {/* Border */}
                  <div className={`absolute inset-0 border transition-colors duration-300 ${
                    activeCategory === category ? 'border-accent' : 'border-border hover:border-foreground/50'
                  }`} />
                  <span className="relative z-10">{category}</span>
                </motion.button>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        {/* Projects Grid - Bento Style */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <RevealOnScroll delay={0.4}>
          <div className="flex justify-center mt-16 md:mt-24">
            <motion.button
              className="group relative px-12 py-6 border-2 border-foreground font-display font-bold tracking-wider overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-4 text-lg group-hover:text-background transition-colors duration-500">
                VIEW ALL PROJECTS
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-foreground"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.button>
          </div>
        </RevealOnScroll>
      </motion.div>
    </section>
  );
};

export default Portfolio;

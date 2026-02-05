import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ScrollReveal';
import MagneticElement from '@/components/MagneticElement';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  tags: string[];
  image: string;
  color: string;
  stats: { label: string; value: string };
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Revolution',
    category: 'E-commerce',
    tags: ['Web Design', 'Development', '3D'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90',
    color: '#ff0000',
    stats: { label: 'Revenue Increase', value: '+340%' },
  },
  {
    id: 2,
    title: 'SaaS Dashboard Pro',
    category: 'SaaS',
    tags: ['UI/UX', 'Product Design'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90',
    color: '#3b82f6',
    stats: { label: 'User Retention', value: '+85%' },
  },
  {
    id: 3,
    title: 'High-Converting Funnel',
    category: 'Funnels',
    tags: ['Sales Funnel', 'CRO'],
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=90',
    color: '#22c55e',
    stats: { label: 'Conversion Rate', value: '12.4%' },
  },
  {
    id: 4,
    title: '3D Brand Experience',
    category: 'Websites',
    tags: ['3D', 'Interactive', 'WebGL'],
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&q=90',
    color: '#f59e0b',
    stats: { label: 'Engagement Time', value: '+420%' },
  },
  {
    id: 5,
    title: 'Luxury Real Estate',
    category: 'Websites',
    tags: ['Web Design', 'Animation'],
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&q=90',
    color: '#8b5cf6',
    stats: { label: 'Lead Generation', value: '+250%' },
  },
  {
    id: 6,
    title: 'Crypto Trading Platform',
    category: 'SaaS',
    tags: ['Dashboard', 'Web3'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90',
    color: '#ec4899',
    stats: { label: 'Daily Active Users', value: '50K+' },
  },
];

const categories = ['All', 'Websites', 'Funnels', 'E-commerce', 'SaaS'];

// Horizontal Scroll Gallery Component
const HorizontalGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    
    if (!container || !scroller) return;

    const getScrollAmount = () => {
      return -(scroller.scrollWidth - window.innerWidth);
    };

    const tween = gsap.to(scroller, {
      x: getScrollAmount,
      ease: 'none',
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: () => `+=${Math.abs(getScrollAmount())}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.floor(progress * (projects.length - 1));
        setCurrentIndex(index);
      },
    });

    return () => {
      scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="h-screen relative overflow-hidden">
      <div 
        ref={scrollerRef} 
        className="flex h-full items-center gap-8 px-[10vw] will-change-transform"
      >
        {projects.map((project, index) => (
          <HorizontalProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <span className="text-4xl font-display font-bold text-accent">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <div className="w-32 h-px bg-border relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${((currentIndex + 1) / projects.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          / {String(projects.length).padStart(2, '0')}
        </span>
      </div>
      
      {/* Scroll hint */}
      <div className="absolute bottom-12 right-12 flex items-center gap-3 text-muted-foreground z-20">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
      </div>
    </div>
  );
};

const HorizontalProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
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
      className="relative flex-shrink-0 w-[70vw] md:w-[50vw] lg:w-[40vw] h-[70vh] cursor-pointer group"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Image Container */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
        
        {/* Color overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: project.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div 
        className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end"
        style={{ transform: 'translateZ(40px)' }}
      >
        {/* Number */}
        <motion.span
          className="absolute top-8 left-8 text-[150px] font-display font-black text-foreground/[0.03]"
          style={{ transform: 'translateZ(-20px)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
        
        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 10 }}
        >
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-background/90 backdrop-blur-md text-xs font-body border border-border/50"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-3xl md:text-5xl font-display font-black mb-4 leading-tight"
          animate={{ y: isHovered ? 0 : 10 }}
        >
          {project.title}
        </motion.h3>

        {/* Stats */}
        <motion.div
          className="flex items-center gap-6 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
        >
          <span className="text-3xl font-display font-bold text-accent">
            {project.stats.value}
          </span>
          <span className="text-sm text-muted-foreground">
            {project.stats.label}
          </span>
        </motion.div>

        {/* View Project Link */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isHovered ? 1 : 0.5, x: isHovered ? 0 : -10 }}
        >
          <span className="text-accent font-display font-bold text-sm tracking-wider">
            VIEW PROJECT
          </span>
          <motion.div
            className="w-10 h-10 flex items-center justify-center border border-accent"
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <ArrowUpRight className="w-4 h-4 text-accent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Border animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none border-2 border-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
};

// Grid View Component
const ProjectGrid: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <GridProjectCard key={project.id} project={project} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const GridProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
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
      className="project-card relative group cursor-pointer min-h-[400px] md:min-h-[500px]"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: project.color }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end" style={{ transform: 'translateZ(30px)' }}>
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        >
          {project.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs">{tag}</span>
          ))}
        </motion.div>

        <motion.h3
          className="text-2xl md:text-3xl font-display font-bold mb-3"
          animate={{ opacity: isHovered ? 1 : 0.8, y: isHovered ? 0 : 10 }}
        >
          {project.title}
        </motion.h3>

        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
        >
          <span className="text-accent font-bold text-sm">View Project</span>
          <ArrowUpRight className="w-4 h-4 text-accent" />
        </motion.div>
      </div>

      {/* Border */}
      <motion.div
        className="absolute inset-0 border-2 border-accent pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
};

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'horizontal' | 'grid'>('horizontal');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section ref={containerRef} id="work" className="relative noise overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Section Header - Always visible */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-32">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <ScrollReveal animation="fade-up">
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                <span className="w-12 h-px bg-accent" />
                Selected Work
              </span>
            </ScrollReveal>
            <h2 className="text-[clamp(3rem,10vw,8rem)] font-display font-black leading-[0.85] tracking-tighter">
              <ScrollReveal animation="fade-up" delay={0.1}>
                <span className="block">FEATURED</span>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={0.2}>
                <span className="text-stroke-thick block">PROJECTS</span>
              </ScrollReveal>
            </h2>
          </div>

          {/* Filter & View Toggle */}
          <ScrollReveal animation="fade-left" delay={0.3}>
            <div className="flex flex-col gap-4">
              {/* View Toggle */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`px-4 py-2 text-xs font-display tracking-wider border transition-all ${
                    viewMode === 'horizontal' ? 'bg-accent text-accent-foreground border-accent' : 'border-border text-muted-foreground hover:border-foreground'
                  }`}
                >
                  GALLERY
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-xs font-display tracking-wider border transition-all ${
                    viewMode === 'grid' ? 'bg-accent text-accent-foreground border-accent' : 'border-border text-muted-foreground hover:border-foreground'
                  }`}
                >
                  GRID
                </button>
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`relative px-5 py-2 text-sm font-body transition-all overflow-hidden ${
                      activeCategory === category
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeCategory === category ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />
                    <div className={`absolute inset-0 border ${
                      activeCategory === category ? 'border-accent' : 'border-border'
                    }`} />
                    <span className="relative z-10">{category}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'horizontal' ? (
        <HorizontalGallery />
      ) : (
        <div className="container mx-auto px-4 md:px-6 pb-32">
          <ProjectGrid projects={filteredProjects} />
        </div>
      )}

      {/* View All CTA */}
      <div className="container mx-auto px-4 md:px-6 pb-32">
        <ScrollReveal animation="fade-up" delay={0.4}>
          <div className="flex justify-center">
            <MagneticElement
              as="button"
              className="group relative px-12 py-6 border-2 border-foreground font-display font-bold tracking-wider overflow-hidden"
              strength={0.3}
            >
              <span className="relative z-10 flex items-center gap-4 text-lg group-hover:text-background transition-colors duration-500">
                VIEW ALL PROJECTS
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-foreground"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: 'left' }}
              />
            </MagneticElement>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Portfolio;
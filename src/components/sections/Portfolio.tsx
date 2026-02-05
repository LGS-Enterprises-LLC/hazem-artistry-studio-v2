import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import SplitText from '@/components/SplitText';

interface Project {
  id: number;
  title: string;
  category: string;
  tags: string[];
  image: string;
  size: 'large' | 'medium' | 'small';
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Revolution',
    category: 'E-commerce',
    tags: ['Web Design', 'Development'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    size: 'large',
  },
  {
    id: 2,
    title: 'SaaS Dashboard',
    category: 'SaaS',
    tags: ['UI/UX', 'Product Design'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    size: 'medium',
  },
  {
    id: 3,
    title: 'High-Converting Funnel',
    category: 'Funnels',
    tags: ['Sales Funnel', 'CRO'],
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    size: 'medium',
  },
  {
    id: 4,
    title: 'Brand Experience',
    category: 'Websites',
    tags: ['3D', 'Interactive'],
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    size: 'large',
  },
  {
    id: 5,
    title: 'Luxury Real Estate',
    category: 'Websites',
    tags: ['Web Design', 'Animation'],
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
    size: 'medium',
  },
  {
    id: 6,
    title: 'Crypto Platform',
    category: 'SaaS',
    tags: ['Dashboard', 'Web3'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    size: 'medium',
  },
];

const categories = ['All', 'Websites', 'Funnels', 'E-commerce', 'SaaS'];

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="work" className="relative py-32 md:py-48 noise">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <RevealOnScroll>
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                <span className="w-12 h-px bg-accent" />
                Selected Work
              </span>
            </RevealOnScroll>
            <h2 className="text-mega font-display">
              <SplitText text="FEATURED" delay={0.1} />
              <br />
              <span className="text-stroke">
                <SplitText text="PROJECTS" delay={0.3} />
              </span>
            </h2>
          </div>

          {/* Filter Buttons */}
          <RevealOnScroll delay={0.3}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 text-sm font-body transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-foreground text-background'
                      : 'bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        {/* Projects Grid - Bento Style */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`project-card relative group ${
                  project.size === 'large'
                    ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto min-h-[400px]'
                    : 'aspect-[4/3]'
                }`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Image */}
                <div className="absolute inset-0 bg-secondary overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0, y: hoveredProject === project.id ? 0 : 10 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-2 mb-3"
                  >
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-2xl md:text-3xl font-display font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0, y: hoveredProject === project.id ? 0 : 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {project.title}
                  </motion.h3>

                  {/* View Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0, y: hoveredProject === project.id ? 0 : 20 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="inline-flex items-center gap-2 text-accent mt-2"
                  >
                    <span className="text-sm font-body">View Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Border Animation */}
                <motion.div
                  className="absolute inset-0 border-2 border-accent pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Corner Accent */}
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: hoveredProject === project.id ? 1 : 0, scale: hoveredProject === project.id ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="absolute top-0 right-0 w-full h-full bg-accent" />
                  <ArrowUpRight className="absolute top-2 right-2 w-6 h-6 text-accent-foreground" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <RevealOnScroll delay={0.4}>
          <div className="flex justify-center mt-16">
            <motion.button
              className="group relative px-12 py-5 border border-foreground font-display font-semibold tracking-wider overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3 group-hover:text-background transition-colors duration-500">
                VIEW ALL PROJECTS
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-foreground"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default Portfolio;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import TiltCard from '@/components/TiltCard';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  featured?: boolean;
  colSpan?: number;
  rowSpan?: number;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Lumina E-Commerce',
    category: 'E-commerce',
    description: 'A revolutionary shopping experience with 3D product visualization',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tags: ['React', 'Three.js', 'Shopify'],
    featured: true,
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: 2,
    title: 'FinanceFlow',
    category: 'SaaS',
    description: 'Modern fintech dashboard with real-time analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Next.js', 'TypeScript', 'Charts'],
  },
  {
    id: 3,
    title: 'Artistry Studio',
    category: 'Portfolio',
    description: 'Creative agency showcase with immersive animations',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    tags: ['GSAP', 'WebGL', 'Framer'],
  },
  {
    id: 4,
    title: 'NutriLife',
    category: 'Landing Page',
    description: 'High-converting health supplement funnel',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    tags: ['Funnel', 'A/B Testing', 'CRO'],
    colSpan: 2,
  },
  {
    id: 5,
    title: 'TechVault',
    category: 'SaaS',
    description: 'Enterprise security platform with sleek UI',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
    tags: ['React', 'Node.js', 'Security'],
  },
  {
    id: 6,
    title: 'Wanderlust Travel',
    category: 'E-commerce',
    description: 'Immersive travel booking experience',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    tags: ['Next.js', 'Maps API', 'Stripe'],
  },
];

const categories = ['All', 'E-commerce', 'SaaS', 'Portfolio', 'Landing Page'];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="work" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
              Portfolio
            </span>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Featured <span className="text-gradient">Work</span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              A collection of projects where design meets performance, 
              creating unforgettable digital experiences.
            </p>
          </FadeIn>
        </div>

        {/* Filter Buttons */}
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-foreground text-background'
                    : 'bg-secondary border border-border hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </FadeIn>

        {/* Bento Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`
                  ${project.colSpan === 2 ? 'md:col-span-2' : 'col-span-1'}
                  ${project.rowSpan === 2 ? 'md:row-span-2' : 'row-span-1'}
                `}
              >
                <TiltCard className="h-full">
                  <motion.div
                    className="bento-item h-full cursor-pointer group"
                    onHoverStart={() => setHoveredProject(project.id)}
                    onHoverEnd={() => setHoveredProject(null)}
                  >
                    {/* Image */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: hoveredProject === project.id ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
                        initial={{ opacity: 0.3 }}
                        animate={{
                          opacity: hoveredProject === project.id ? 0.95 : 0.3,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: hoveredProject === project.id ? 0 : 20,
                          opacity: hoveredProject === project.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="mb-3"
                      >
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                          {project.category}
                        </span>
                      </motion.div>

                      <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mb-2">
                        {project.title}
                      </h3>

                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{
                          y: hoveredProject === project.id ? 0 : 10,
                          opacity: hoveredProject === project.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-muted-foreground text-sm mb-4"
                      >
                        {project.description}
                      </motion.p>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{
                          y: hoveredProject === project.id ? 0 : 10,
                          opacity: hoveredProject === project.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        className="flex flex-wrap gap-2"
                      >
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded bg-secondary/80 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>

                      {/* Arrow Icon */}
                      <motion.div
                        className="absolute top-6 right-6"
                        initial={{ x: -10, y: 10, opacity: 0 }}
                        animate={{
                          x: hoveredProject === project.id ? 0 : -10,
                          y: hoveredProject === project.id ? 0 : 10,
                          opacity: hoveredProject === project.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-background" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <FadeIn delay={0.4} className="text-center mt-16">
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border bg-transparent hover:bg-secondary transition-all duration-300 font-display font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </FadeIn>
      </div>
    </section>
  );
};

export default Portfolio;

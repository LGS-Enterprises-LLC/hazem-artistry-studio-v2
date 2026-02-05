import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn';

const technologies = {
  Frontend: [
    { name: 'React', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Framer Motion', icon: '✨' },
    { name: 'Three.js', icon: '🎮' },
  ],
  Backend: [
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python', icon: '🐍' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Firebase', icon: '🔥' },
    { name: 'Supabase', icon: '⚡' },
    { name: 'GraphQL', icon: '◈' },
  ],
  Design: [
    { name: 'Figma', icon: '🎯' },
    { name: 'After Effects', icon: '🎬' },
    { name: 'Blender', icon: '🧊' },
    { name: 'Photoshop', icon: '📷' },
    { name: 'Illustrator', icon: '✏️' },
    { name: 'Premiere', icon: '🎥' },
  ],
  Tools: [
    { name: 'Git', icon: '📂' },
    { name: 'Vercel', icon: '▲' },
    { name: 'AWS', icon: '☁️' },
    { name: 'Stripe', icon: '💳' },
    { name: 'Analytics', icon: '📊' },
    { name: 'SEO', icon: '🔍' },
  ],
};

const TechStack: React.FC = () => {
  return (
    <section id="stack" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
              Tech Stack
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Tools & <span className="text-gradient">Technologies</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Mastering the best tools in the industry to deliver exceptional results.
            </p>
          </FadeIn>
        </div>

        {/* Tech Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(technologies).map(([category, techs], catIndex) => (
            <FadeIn key={category} delay={0.1 + catIndex * 0.1}>
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-accent mb-6">
                  {category}
                </h3>
                <div className="space-y-3">
                  {techs.map((tech, techIndex) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.1 + techIndex * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="group flex items-center gap-4 p-3 rounded-xl bg-card/50 border border-border/30 hover:border-accent/30 hover:bg-card transition-all duration-300 cursor-default"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {tech.icon}
                      </span>
                      <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                        {tech.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;

import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn';
import Counter from '@/components/Counter';
import hazemPortrait from '@/assets/hazem-portrait.jpg';

const About: React.FC = () => {
  const stats = [
    { value: 7, suffix: '+', label: 'Years Experience' },
    { value: 50, suffix: '+', label: 'Projects Completed' },
    { value: 30, suffix: '+', label: 'Happy Clients' },
    { value: 10, prefix: '$', suffix: 'M+', label: 'Revenue Generated' },
  ];

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Portrait */}
          <FadeIn direction="left" className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Glow Effect Behind Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-brand-purple/30 blur-3xl scale-110 opacity-50" />
              
              {/* Portrait Image */}
              <motion.div
                className="relative rounded-3xl overflow-hidden border border-border/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={hazemPortrait}
                  alt="Hazem Magdy - Elite Web Designer"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl bg-card border border-border/50 backdrop-blur-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <span className="block font-display font-bold text-2xl text-foreground">
                  <Counter value={7} suffix="+" />
                </span>
                <span className="text-sm text-muted-foreground">Years of Excellence</span>
              </motion.div>
            </div>
          </FadeIn>

          {/* Right - Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <FadeIn>
              <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
                About Me
              </span>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                Hi, I'm{' '}
                <span className="text-gradient">Hazem Magdy</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                An elite web designer obsessed with creating digital experiences that don't just look beautiful—they convert, inspire, and leave lasting impressions.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With over 7 years in the industry, I've helped businesses across the globe transform their online presence into powerful revenue-generating machines. My philosophy? Every pixel matters. Every interaction counts.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-3">
                {['Web Design', 'Sales Funnels', '3D & Animation', 'Performance', 'Conversion Optimization'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full bg-secondary border border-border text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Stats Row */}
            <FadeIn delay={0.5}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="block font-display font-bold text-2xl md:text-3xl text-foreground">
                      <Counter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

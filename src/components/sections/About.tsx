import React from 'react';
import { motion } from 'framer-motion';
import RevealOnScroll from '@/components/RevealOnScroll';
import SplitText from '@/components/SplitText';

const About: React.FC = () => {
  const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '$10M+', label: 'Revenue Generated' },
    { value: '100%', label: 'Client Satisfaction' },
    { value: '5+', label: 'Years Experience' },
  ];

  return (
    <section id="about" className="relative py-32 md:py-48 overflow-hidden noise">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-20">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              About
            </span>
          </RevealOnScroll>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Text */}
          <div>
            <h2 className="text-mega font-display mb-8">
              <SplitText text="I CREATE WEBSITES THAT MAKE PEOPLE" delay={0.1} />
              <span className="text-accent block mt-2">
                <SplitText text="STOP SCROLLING." delay={0.4} />
              </span>
            </h2>

            <RevealOnScroll delay={0.3}>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-body">
                I'm Hazem Magdy, a web designer obsessed with creating digital experiences 
                that don't just look beautiful—they convert. Every pixel, every animation, 
                every interaction is designed with one goal: to make your brand unforgettable.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
              <p className="text-lg text-muted-foreground leading-relaxed font-body">
                From high-converting sales funnels to immersive 3D websites, I combine 
                cutting-edge technology with timeless design principles to deliver results 
                that exceed expectations.
              </p>
            </RevealOnScroll>

            {/* Specializations */}
            <RevealOnScroll delay={0.5}>
              <div className="flex flex-wrap gap-3 mt-12">
                {['Web Design', 'Sales Funnels', '3D Experiences', 'UI/UX', 'Branding'].map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 border border-border text-sm font-body text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column - Image & Stats */}
          <div className="relative">
            {/* Portrait */}
            <RevealOnScroll direction="right" delay={0.2}>
              <div className="relative aspect-[4/5] mb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card">
                  <img
                    src="/placeholder.svg"
                    alt="Hazem Magdy"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-accent" />
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent" />
              </div>
            </RevealOnScroll>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-px bg-border">
              {stats.map((stat, i) => (
                <RevealOnScroll key={i} delay={0.3 + i * 0.1}>
                  <div className="bg-background p-6 md:p-8 group hover:bg-secondary transition-colors">
                    <motion.span
                      className="block text-4xl md:text-5xl font-display font-bold mb-2 group-hover:text-accent transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.span>
                    <span className="text-sm text-muted-foreground font-body">{stat.label}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

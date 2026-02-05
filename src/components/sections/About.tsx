import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import KineticText from '@/components/KineticText';
import RevealOnScroll from '@/components/RevealOnScroll';
import Counter from '@/components/Counter';
import hazemHero from '@/assets/hazem-hero.png';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imageRef, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const stats = [
    { value: 50, suffix: '+', label: 'Projects Delivered' },
    { value: 10, prefix: '$', suffix: 'M+', label: 'Revenue Generated' },
    { value: 100, suffix: '%', label: 'Client Satisfaction' },
    { value: 5, suffix: '+', label: 'Years Experience' },
  ];

  const skills = [
    'Web Design', 'Sales Funnels', '3D Experiences', 
    'UI/UX', 'Branding', 'Motion Design', 'WebGL', 'CRO'
  ];

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative py-32 md:py-48 overflow-hidden noise"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div 
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none"
        style={{ y: textY }}
      />
      
      {/* Floating accent shapes */}
      <motion.div
        className="absolute top-1/4 left-[10%] w-32 h-32 border border-accent/20"
        animate={{ rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-[5%] w-48 h-48 border border-foreground/5 rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              About Me
            </span>
          </RevealOnScroll>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column - Image */}
          <div ref={imageRef} className="lg:col-span-5 relative">
            <motion.div 
              className="relative aspect-[4/5] sticky top-32"
              style={{ y: imageY }}
            >
              {/* Image container with reveal */}
              <div className="relative overflow-hidden h-full">
                <motion.div
                  className="absolute inset-0 bg-background z-10"
                  initial={{ x: 0 }}
                  animate={isInView ? { x: '100%' } : { x: 0 }}
                  transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
                />
                <motion.img
                  src={hazemHero}
                  alt="Hazem Magdy"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.3 }}
                  animate={isInView ? { scale: 1 } : { scale: 1.3 }}
                  transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
                />
                
                {/* Overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
              </div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -bottom-4 -right-4 w-32 h-32 border border-accent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
              <motion.div 
                className="absolute -top-4 -left-4 w-16 h-16 bg-accent"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
              />
              
              {/* Quote badge */}
              <motion.div
                className="absolute -right-8 md:-right-16 top-1/2 -translate-y-1/2 bg-secondary border border-border p-4 md:p-6 max-w-[200px]"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <span className="text-4xl font-display text-accent">"</span>
                <p className="text-sm text-muted-foreground font-body italic">
                  Every pixel must have purpose.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Text */}
          <div className="lg:col-span-7">
            <motion.div style={{ y: textY }}>
              <h2 className="text-[clamp(2rem,6vw,5rem)] font-display font-bold leading-[0.9] mb-8">
                <KineticText 
                  text="I CREATE WEBSITES" 
                  type="words" 
                  animation="fade-up" 
                  delay={0.2}
                />
                <br />
                <span className="block mt-2">
                  <KineticText 
                    text="THAT MAKE PEOPLE" 
                    type="words" 
                    animation="fade-up" 
                    delay={0.4}
                  />
                </span>
                <span className="text-accent block mt-2">
                  <KineticText 
                    text="STOP SCROLLING." 
                    type="words" 
                    animation="fade-up" 
                    delay={0.6}
                  />
                </span>
              </h2>

              <RevealOnScroll delay={0.3}>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 font-body max-w-2xl">
                  I'm Hazem Magdy, a web designer obsessed with creating digital experiences 
                  that don't just look beautiful—<span className="text-foreground">they convert</span>. Every pixel, every animation, 
                  every interaction is designed with one goal: to make your brand unforgettable.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={0.4}>
                <p className="text-lg text-muted-foreground leading-relaxed font-body max-w-2xl mb-12">
                  From high-converting sales funnels to immersive 3D websites, I combine 
                  cutting-edge technology with timeless design principles to deliver results 
                  that exceed expectations. My work has generated over <span className="text-accent font-semibold">$10M+</span> for clients worldwide.
                </p>
              </RevealOnScroll>

              {/* Skills Grid */}
              <RevealOnScroll delay={0.5}>
                <div className="flex flex-wrap gap-3 mb-16">
                  {skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      className="px-4 py-2 border border-border text-sm font-body text-muted-foreground hover:border-accent hover:text-foreground hover:bg-accent/5 transition-all cursor-default"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </RevealOnScroll>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="bg-background p-6 md:p-8 group hover:bg-secondary transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="block text-3xl md:text-5xl font-display font-bold mb-2 group-hover:text-accent transition-colors">
                      <Counter 
                        value={stat.value} 
                        prefix={stat.prefix} 
                        suffix={stat.suffix} 
                        duration={2} 
                        delay={0.5 + i * 0.2} 
                      />
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground font-body">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

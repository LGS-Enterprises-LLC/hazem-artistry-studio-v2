import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import Counter from '@/components/Counter';
import MagneticElement from '@/components/MagneticElement';
import hazemHero from '@/assets/hazem-hero.png';
import { ArrowUpRight, MousePointer2 } from 'lucide-react';
import FluidPaintCanvas from '@/components/FluidPaintCanvas';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imageRef, { once: true, margin: '-100px' });
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const textY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  const stats = [
    { value: 50, suffix: '+', label: 'Projects Delivered' },
    { value: 10, prefix: '$', suffix: 'M+', label: 'Revenue Generated' },
    { value: 100, suffix: '%', label: 'Client Satisfaction' },
    { value: 5, suffix: '+', label: 'Years Experience' },
  ];

  const skills = [
    { name: 'Web Design', level: 98 },
    { name: 'Sales Funnels', level: 95 },
    { name: '3D/WebGL', level: 90 },
    { name: 'UI/UX', level: 96 },
    { name: 'Branding', level: 88 },
    { name: 'Motion Design', level: 92 },
    { name: 'CRO', level: 94 },
    { name: 'Development', level: 85 },
  ];

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative py-32 md:py-48 overflow-hidden"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      {/* Fluid Paint Canvas - Emerald/Green Theme */}
      <FluidPaintCanvas 
        className="z-0 pointer-events-auto"
        colors={['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857']}
        particleSize={45}
        fadeSpeed={0.015}
        trailLength={16}
        glowIntensity={1.4}
        maxParticles={250}
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 noise pointer-events-none" />
      
      {/* Floating accent shapes */}
      <motion.div
        className="absolute top-1/4 right-[10%] w-96 h-96 bg-accent/10 rounded-full blur-[150px]"
        style={{ y: textY }}
      />
      <motion.div
        className="absolute -top-20 -left-20 w-40 h-40 border-2 border-accent/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-40 right-[20%] w-20 h-20 bg-accent/30"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <ScrollReveal animation="fade-up">
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <motion.span 
                className="w-12 h-px bg-accent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
              About Me
            </span>
          </ScrollReveal>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-20">
          {/* Left Column - Image */}
          <div ref={imageRef} className="lg:col-span-5 relative pointer-events-auto">
            <motion.div 
              className="relative aspect-[3/4] lg:sticky lg:top-32"
              style={{ y: imageY, scale: imageScale, rotate }}
            >
              {/* Multiple layered frames for depth */}
              <motion.div
                className="absolute -inset-4 border border-accent/20"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              />
              <motion.div
                className="absolute -inset-8 border border-foreground/5"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
              />
              
              {/* Image container with reveal */}
              <div className="relative overflow-hidden h-full">
                <motion.div
                  className="absolute inset-0 bg-accent z-10"
                  initial={{ x: 0 }}
                  animate={isInView ? { x: '102%' } : { x: 0 }}
                  transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
                />
                <motion.img
                  src={hazemHero}
                  alt="Hazem Magdy"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.4 }}
                  animate={isInView ? { scale: 1 } : { scale: 1.4 }}
                  transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                />
                
                {/* Overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <motion.div 
                  className="absolute inset-0 bg-accent/20 mix-blend-multiply"
                  animate={{ opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
              
              {/* Decorative corner accents */}
              <motion.div 
                className="absolute -bottom-6 -right-6 w-24 h-24 border-2 border-accent"
                initial={{ scale: 0, rotate: -45 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ delay: 1, type: 'spring' }}
              />
              <motion.div 
                className="absolute -top-6 -left-6 w-12 h-12 bg-accent"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 1.2, type: 'spring' }}
              />
              
              {/* Experience badge */}
              <motion.div
                className="absolute -right-4 md:-right-12 bottom-1/4 bg-background border border-border p-6 backdrop-blur-xl"
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.4 }}
              >
                <span className="text-5xl font-display font-black text-accent block">5+</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Years of<br/>Excellence</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Text */}
          <div className="lg:col-span-7 pointer-events-auto">
            <motion.div style={{ y: textY }}>
              {/* Headline */}
              <ScrollReveal animation="fade-up" delay={0.2}>
                <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-display font-black leading-[0.9] mb-8 tracking-tight">
                  I CREATE WEBSITES
                  <br />
                  <span className="text-stroke-thick">THAT MAKE PEOPLE</span>
                  <br />
                  <span className="text-accent">STOP SCROLLING.</span>
                </h2>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal animation="fade-up" delay={0.3}>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6 font-body max-w-2xl">
                  I'm Hazem Magdy, a web designer obsessed with creating digital experiences 
                  that don't just look beautiful—<span className="text-foreground font-semibold">they convert</span>.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={0.4}>
                <p className="text-lg text-muted-foreground leading-relaxed font-body max-w-2xl mb-12">
                  From high-converting sales funnels to immersive 3D websites, I combine 
                  cutting-edge technology with timeless design principles. My work has generated over 
                  <span className="text-accent font-bold"> $10M+</span> for clients worldwide.
                </p>
              </ScrollReveal>

              {/* Skills with animated bars */}
              <ScrollReveal animation="fade-up" delay={0.5}>
                <div className="grid grid-cols-2 gap-4 mb-16">
                  {skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      className="group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-xs font-display text-accent">{skill.level}%</span>
                      </div>
                      <div className="h-1 bg-border overflow-hidden">
                        <motion.div
                          className="h-full bg-accent origin-left"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: skill.level / 100 }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-border/50">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="bg-background p-6 md:p-8 group hover:bg-secondary transition-all duration-500 cursor-default"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.span 
                      className="block text-3xl md:text-5xl font-display font-black mb-2 group-hover:text-accent transition-colors"
                    >
                      <Counter 
                        value={stat.value} 
                        prefix={stat.prefix} 
                        suffix={stat.suffix} 
                        duration={2} 
                        delay={0.5 + i * 0.2} 
                      />
                    </motion.span>
                    <span className="text-xs md:text-sm text-muted-foreground font-body uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <ScrollReveal animation="fade-up" delay={0.6}>
                <div className="mt-12">
                  <MagneticElement
                    as="a"
                    href="#contact"
                    className="inline-flex items-center gap-4 group"
                    strength={0.3}
                  >
                    <span className="text-lg font-display font-bold tracking-wider group-hover:text-accent transition-colors">
                      LET'S WORK TOGETHER
                    </span>
                    <motion.div
                      className="w-12 h-12 flex items-center justify-center border-2 border-foreground group-hover:border-accent group-hover:bg-accent transition-all"
                      whileHover={{ rotate: 45 }}
                    >
                      <ArrowUpRight className="w-5 h-5 group-hover:text-accent-foreground transition-colors" />
                    </motion.div>
                  </MagneticElement>
                </div>
              </ScrollReveal>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
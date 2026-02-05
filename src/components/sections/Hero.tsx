import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import AnimatedText from '@/components/AnimatedText';
import MagneticButton from '@/components/MagneticButton';

const Hero: React.FC = () => {
  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 noise-overlay" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-brand-purple/10 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-brand-gold/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">
            Crafting Digital Excellence
          </span>
        </motion.div>

        {/* Main Headline */}
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] tracking-tight mb-6">
          <AnimatedText 
            text="Design That" 
            className="justify-center"
            delay={0.4}
          />
          <span className="block mt-2">
            <AnimatedText 
              text="Makes" 
              className="justify-center inline-flex"
              delay={0.7}
            />
            <span className="text-gradient ml-4 inline-block">
              <AnimatedText 
                text="Jaws Drop"
                className="justify-center inline-flex"
                delay={0.9}
              />
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 font-body"
        >
          Elite web design agency crafting high-converting websites and sales funnels 
          that generate millions for ambitious brands worldwide.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton 
            className="px-8 py-4 bg-foreground text-background glow-button"
            onClick={scrollToWork}
          >
            View My Work
          </MagneticButton>
          <MagneticButton 
            className="px-8 py-4 border border-border bg-transparent hover:bg-secondary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start a Project
          </MagneticButton>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex flex-wrap justify-center gap-12 mt-20"
        >
          {[
            { value: '50+', label: 'Projects Delivered' },
            { value: '$10M+', label: 'Client Revenue Generated' },
            { value: '100%', label: 'Client Satisfaction' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <span className="block font-display font-bold text-3xl md:text-4xl text-foreground">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          className="scroll-bounce"
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

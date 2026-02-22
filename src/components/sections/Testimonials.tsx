import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, MousePointer2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import FluidPaintCanvas from '@/components/FluidPaintCanvas';

const testimonials = [
  {
    id: 1,
    quote: "Hazem is a rare talent. He doesn't just design websites—he crafts experiences that convert. Our revenue increased by 300% after launching the new site.",
    author: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
    company: 'TechStart',
    metric: '+300%',
    metricLabel: 'Revenue Increase',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: 2,
    quote: "Working with Hazem was a game-changer. The attention to detail and creativity exceeded our expectations. Our brand has never looked better online.",
    author: 'Michael Chen',
    role: 'Founder, NovaBrand',
    company: 'NovaBrand',
    metric: '5x',
    metricLabel: 'More Leads',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    id: 3,
    quote: "The sales funnel Hazem built for us generated $1.2M in the first month alone. His understanding of conversion psychology is unmatched.",
    author: 'Emily Rodriguez',
    role: 'CMO, ScaleUp Co.',
    company: 'ScaleUp',
    metric: '$1.2M',
    metricLabel: 'First 30 Days',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  {
    id: 4,
    quote: "We've worked with many agencies but Hazem stands apart. The 3D interactive experience he created has become our biggest competitive advantage.",
    author: 'David Park',
    role: 'CTO, InnovateTech',
    company: 'InnovateTech',
    metric: '40%',
    metricLabel: 'Lower Bounce',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      ref={containerRef} 
      id="testimonials" 
      className="relative py-32 md:py-48 bg-card overflow-hidden"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      {/* Fluid Paint Canvas - Indigo/Blue Theme */}
      <FluidPaintCanvas 
        className="z-0 pointer-events-auto"
        colors={['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc']}
        particleSize={40}
        fadeSpeed={0.02}
        trailLength={12}
        glowIntensity={1.2}
        maxParticles={120}
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 noise pointer-events-none" />
      
      {/* Accent gradient */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-accent/5 to-transparent" />
      
      {/* Large quote marks */}
      <motion.div
        className="absolute top-1/4 right-[5%] text-[500px] font-display font-black text-foreground/[0.02] leading-none pointer-events-none select-none hidden lg:block"
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        "
      </motion.div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center pointer-events-auto">
          {/* Left Column - Header */}
          <div>
            <ScrollReveal animation="fade-up">
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                <span className="w-12 h-px bg-accent" />
                Testimonials
              </span>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={0.1}>
              <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-display font-black leading-[0.85] mb-8 tracking-tighter">
                WHAT CLIENTS <span className="text-accent">SAY</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={0.2}>
              <p className="text-lg text-muted-foreground mb-12 font-body max-w-md">
                Don't just take my word for it. Here's what industry leaders have to say 
                about our collaboration.
              </p>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal animation="fade-up" delay={0.3}>
              <div className="grid grid-cols-3 gap-1 mb-12 bg-border/50">
                {[
                  { value: '50+', label: 'Happy Clients' },
                  { value: '$10M+', label: 'Revenue Generated' },
                  { value: '5★', label: 'Average Rating' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    className="text-center p-6 bg-background"
                    whileHover={{ backgroundColor: 'hsl(var(--secondary))' }}
                  >
                    <span className="block text-2xl md:text-3xl font-display font-black text-accent">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Navigation */}
            <ScrollReveal animation="fade-up" delay={0.4}>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={prev}
                  className="w-14 h-14 flex items-center justify-center border-2 border-border hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={next}
                  className="w-14 h-14 flex items-center justify-center border-2 border-border hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <div className="ml-4 flex items-center gap-2">
                  <span className="text-3xl font-display font-black text-accent">
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-sm text-muted-foreground">
                    {String(testimonials.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Testimonial Card */}
          <div className="relative min-h-[550px]" style={{ perspective: 1000 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <div className="bg-background border border-border p-8 md:p-12 h-full relative overflow-hidden">
                  {/* Corner accents */}
                  <motion.div 
                    className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  />
                  
                  {/* Quote Icon */}
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      initial={{ rotate: -20, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <Quote className="w-12 h-12 text-accent" />
                    </motion.div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                        >
                          <Star className="w-5 h-5 fill-accent text-accent" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <motion.blockquote 
                    className="text-xl md:text-2xl font-display leading-relaxed mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    "{currentTestimonial.quote}"
                  </motion.blockquote>

                  {/* Author */}
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="relative">
                      <img
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.author}
                        className="w-16 h-16 rounded-full object-cover grayscale hover:grayscale-0 transition-all"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-lg">
                        {currentTestimonial.author}
                      </p>
                      <p className="text-muted-foreground text-sm font-body">
                        {currentTestimonial.role}
                      </p>
                    </div>
                    
                    {/* Metric Badge */}
                    <motion.div 
                      className="text-right p-4 bg-accent/10 border border-accent/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="block text-2xl md:text-3xl font-display font-black text-accent">
                        {currentTestimonial.metric}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {currentTestimonial.metricLabel}
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="absolute -bottom-12 left-0 right-0 flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className="relative flex-1 h-1.5 bg-border overflow-hidden rounded-full"
                  whileHover={{ scale: 1.1 }}
                >
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-accent rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 8, ease: 'linear' }}
                    />
                  )}
                  {index < currentIndex && (
                    <div className="absolute inset-0 bg-accent rounded-full" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
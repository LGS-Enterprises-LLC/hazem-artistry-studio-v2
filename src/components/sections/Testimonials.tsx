import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Play } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import KineticText from '@/components/KineticText';

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
    metricLabel: 'More Qualified Leads',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    id: 3,
    quote: "The sales funnel Hazem built for us generated $1.2M in the first month alone. His understanding of conversion psychology is unmatched in the industry.",
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
    metricLabel: 'Lower Bounce Rate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
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
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section ref={containerRef} id="testimonials" className="relative py-32 md:py-48 bg-card noise overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-accent/5 to-transparent" />
      
      {/* Large quote mark */}
      <motion.div
        className="absolute top-1/4 right-[10%] text-[400px] font-display font-bold text-foreground/[0.02] leading-none pointer-events-none select-none"
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        "
      </motion.div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Column - Header */}
          <div>
            <RevealOnScroll>
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                <span className="w-12 h-px bg-accent" />
                Testimonials
              </span>
            </RevealOnScroll>
            <h2 className="text-[clamp(2rem,6vw,5rem)] font-display font-bold leading-[0.85] mb-8">
              <KineticText text="WHAT CLIENTS" type="words" animation="fade-up" delay={0.1} />
              <br />
              <span className="text-accent">
                <KineticText text="SAY" type="words" animation="fade-up" delay={0.3} />
              </span>
            </h2>

            <RevealOnScroll delay={0.4}>
              <p className="text-lg text-muted-foreground mb-12 font-body max-w-md">
                Don't just take my word for it. Here's what industry leaders have to say 
                about our collaboration.
              </p>
            </RevealOnScroll>

            {/* Stats */}
            <RevealOnScroll delay={0.5}>
              <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="text-center p-4 border border-border/50">
                  <span className="block text-3xl md:text-4xl font-display font-bold text-accent">50+</span>
                  <span className="text-xs text-muted-foreground">Happy Clients</span>
                </div>
                <div className="text-center p-4 border border-border/50">
                  <span className="block text-3xl md:text-4xl font-display font-bold text-accent">$10M+</span>
                  <span className="text-xs text-muted-foreground">Revenue Generated</span>
                </div>
                <div className="text-center p-4 border border-border/50">
                  <span className="block text-3xl md:text-4xl font-display font-bold text-accent">5★</span>
                  <span className="text-xs text-muted-foreground">Average Rating</span>
                </div>
              </div>
            </RevealOnScroll>

            {/* Navigation */}
            <RevealOnScroll delay={0.6}>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={prev}
                  className="w-14 h-14 flex items-center justify-center border border-border hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={next}
                  className="w-14 h-14 flex items-center justify-center border border-border hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <span className="ml-4 text-sm text-muted-foreground font-body">
                  <span className="text-foreground font-semibold">{String(currentIndex + 1).padStart(2, '0')}</span>
                  {' / '}
                  {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column - Testimonial Card */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0"
              >
                <div className="bg-background border border-border p-8 md:p-12 h-full relative overflow-hidden">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent/30" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/30" />
                  
                  {/* Quote Icon */}
                  <div className="flex items-center gap-4 mb-8">
                    <Quote className="w-10 h-10 text-accent" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl font-display leading-relaxed mb-10">
                    "{currentTestimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.author}
                        className="w-16 h-16 rounded-full object-cover grayscale"
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
                    <div className="text-right">
                      <span className="block text-3xl font-display font-bold text-accent">
                        {currentTestimonial.metric}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {currentTestimonial.metricLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="absolute -bottom-8 left-0 right-0 flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className="relative flex-1 h-1 bg-border overflow-hidden"
                >
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-accent"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 8, ease: 'linear' }}
                    />
                  )}
                  {index < currentIndex && (
                    <div className="absolute inset-0 bg-accent" />
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

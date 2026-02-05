import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import SplitText from '@/components/SplitText';

const testimonials = [
  {
    id: 1,
    quote: "Hazem is a rare talent. He doesn't just design websites—he crafts experiences that convert. Our revenue increased by 300% after launching the new site.",
    author: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
    metric: '+300% Revenue',
  },
  {
    id: 2,
    quote: "Working with Hazem was a game-changer. The attention to detail and creativity exceeded our expectations. Our brand has never looked better.",
    author: 'Michael Chen',
    role: 'Founder, NovaBrand',
    metric: '5x More Leads',
  },
  {
    id: 3,
    quote: "The sales funnel Hazem built for us generated $1.2M in the first month alone. His understanding of conversion psychology is unmatched.",
    author: 'Emily Rodriguez',
    role: 'CMO, ScaleUp Co.',
    metric: '$1.2M in 30 Days',
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative py-32 md:py-48 bg-card noise">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-accent/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Header */}
          <div>
            <RevealOnScroll>
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                <span className="w-12 h-px bg-accent" />
                Testimonials
              </span>
            </RevealOnScroll>
            <h2 className="text-mega font-display mb-8">
              <SplitText text="WHAT CLIENTS" delay={0.1} />
              <br />
              <span className="text-accent">
                <SplitText text="SAY" delay={0.3} />
              </span>
            </h2>

            <RevealOnScroll delay={0.4}>
              <p className="text-lg text-muted-foreground mb-8 font-body">
                Don't just take my word for it. Here's what clients have to say 
                about working together.
              </p>
            </RevealOnScroll>

            {/* Navigation */}
            <RevealOnScroll delay={0.5}>
              <div className="flex items-center gap-4">
                <button
                  onClick={prev}
                  className="w-14 h-14 flex items-center justify-center border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-14 h-14 flex items-center justify-center border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="ml-4 text-sm text-muted-foreground font-body">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column - Testimonial Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="testimonial-card relative"
              >
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-accent mb-8" />
                
                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-display leading-relaxed mb-8">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-lg">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-muted-foreground text-sm font-body">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                  
                  {/* Metric Badge */}
                  <div className="px-4 py-2 bg-accent text-accent-foreground">
                    <span className="text-sm font-display font-bold">
                      {testimonials[currentIndex].metric}
                    </span>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-accent" />
              </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-12 h-1 transition-colors ${
                    index === currentIndex ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

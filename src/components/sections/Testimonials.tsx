import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechFlow',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    content: "Hazem completely transformed our online presence. The website he built doesn't just look incredible—it's generated over $2M in additional revenue for us.",
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Founder, Innovate Labs',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    content: "Working with Hazem was a game-changer. His attention to detail and understanding of conversion optimization took our funnel from 2% to 8% conversion rate.",
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Director, Scale Up',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    content: "The animations and interactions Hazem created are on another level. Every client meeting now starts with 'Who built your website?' Pure magic.",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
              Testimonials
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Client <span className="text-gradient">Results</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Don't just take my word for it. Here's what my clients have to say 
              about working together.
            </p>
          </FadeIn>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={0.1 + index * 0.15}>
              <motion.div
                className="group relative p-8 rounded-2xl bg-card border border-border/50 h-full"
                whileHover={{ y: -8, borderColor: 'hsl(217, 91%, 60%, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-accent/30 mb-6" />

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-border"
                  />
                  <div>
                    <h4 className="font-display font-bold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

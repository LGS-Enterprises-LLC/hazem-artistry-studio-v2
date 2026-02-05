import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Code2, Rocket, Palette, Zap, Monitor, BarChart, ArrowRight, Check } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import MagneticElement from '@/components/MagneticElement';

const services = [
  {
    icon: Monitor,
    title: 'Web Design & Development',
    description: 'Custom websites built with cutting-edge technology that look stunning and perform flawlessly.',
    features: ['Custom Design', 'Responsive', 'Fast Loading', 'SEO Optimized'],
    price: 'From $5,000',
  },
  {
    icon: Rocket,
    title: 'Sales Funnel Creation',
    description: 'High-converting funnels designed to turn visitors into customers and maximize your ROI.',
    features: ['Landing Pages', 'Email Sequences', 'A/B Testing', 'Analytics'],
    price: 'From $3,000',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'User-centered design that creates intuitive and delightful digital experiences.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    price: 'From $4,000',
  },
  {
    icon: Code2,
    title: 'Custom Animations & 3D',
    description: 'Advanced interactions and 3D elements that make your brand stand out from the crowd.',
    features: ['GSAP Animations', 'Three.js', 'WebGL Effects', 'Scroll Magic'],
    price: 'From $6,000',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Blazing-fast websites that rank higher on Google and provide better user experiences.',
    features: ['Core Web Vitals', 'Lazy Loading', 'Code Splitting', 'CDN Setup'],
    price: 'From $2,000',
  },
  {
    icon: BarChart,
    title: 'Conversion Rate Optimization',
    description: 'Data-driven strategies to increase conversions and generate more revenue from traffic.',
    features: ['Analytics Setup', 'Heat Mapping', 'User Testing', 'A/B Testing'],
    price: 'From $2,500',
  },
];

const ServiceCard: React.FC<{ service: typeof services[0]; index: number }> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-background border border-border/50 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent"
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 1.5 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Glowing border on hover */}
      <motion.div
        className="absolute inset-0 border-2 border-accent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      
      {/* Content */}
      <div className="relative p-8 md:p-10 h-full flex flex-col">
        {/* Number & Icon Row */}
        <div className="flex items-start justify-between mb-8">
          <motion.div
            className="w-16 h-16 flex items-center justify-center border border-border transition-all duration-500"
            animate={{ 
              borderColor: isHovered ? 'hsl(var(--accent))' : 'hsl(var(--border))',
              backgroundColor: isHovered ? 'hsl(var(--accent) / 0.1)' : 'transparent',
            }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <service.icon className="w-7 h-7 text-muted-foreground transition-colors duration-500 group-hover:text-accent" />
          </motion.div>
          <motion.span 
            className="text-[80px] font-display font-black text-foreground/[0.03] leading-none select-none -mt-4 -mr-2 transition-colors duration-500"
            animate={{ color: isHovered ? 'hsl(var(--accent) / 0.1)' : 'hsl(var(--foreground) / 0.03)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>
        </div>

        {/* Title */}
        <motion.h3 
          className="text-xl md:text-2xl font-display font-bold mb-4 transition-colors duration-500"
          animate={{ color: isHovered ? 'hsl(var(--accent))' : 'hsl(var(--foreground))' }}
        >
          {service.title}
        </motion.h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 font-body leading-relaxed flex-grow">
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {service.features.map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="group-hover:text-foreground transition-colors">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <span className="text-lg font-display font-bold text-accent">{service.price}</span>
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-accent transition-colors"
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-accent origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} id="services" className="relative py-32 md:py-48 bg-secondary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 noise pointer-events-none" />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 right-[10%] w-80 h-80 border border-accent/10 rounded-full"
        style={{ y }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-[5%] w-60 h-60 bg-accent/5 rounded-full blur-[100px]"
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <ScrollReveal animation="fade-up">
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Services
              <span className="w-12 h-px bg-accent" />
            </span>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={0.1}>
            <h2 className="text-[clamp(3rem,10vw,8rem)] font-display font-black leading-[0.85] tracking-tighter">
              WHAT I <span className="text-accent">DO</span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={0.2}>
            <p className="max-w-2xl mx-auto mt-8 text-lg text-muted-foreground font-body">
              Comprehensive digital solutions designed to elevate your brand 
              and drive measurable results.
            </p>
          </ScrollReveal>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal animation="fade-up" delay={0.5}>
          <div className="text-center mt-16 md:mt-24">
            <p className="text-muted-foreground mb-8 font-body text-lg">
              Need something custom? Let's talk about your project.
            </p>
            <MagneticElement
              as="a"
              href="#contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-accent-foreground font-display font-bold tracking-wider hover:scale-105 transition-transform"
              strength={0.3}
            >
              GET IN TOUCH
              <ArrowRight className="w-5 h-5" />
            </MagneticElement>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Services;
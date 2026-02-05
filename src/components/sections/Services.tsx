import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Code2, Rocket, Palette, Zap, Monitor, BarChart, ArrowRight } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import KineticText from '@/components/KineticText';
import MagneticElement from '@/components/MagneticElement';

const services = [
  {
    icon: Monitor,
    title: 'Web Design & Development',
    description: 'Custom websites built with cutting-edge technology that look stunning and perform flawlessly.',
    features: ['Custom Design', 'Responsive', 'Fast Loading', 'SEO Optimized'],
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  {
    icon: Rocket,
    title: 'Sales Funnel Creation',
    description: 'High-converting funnels designed to turn visitors into customers and maximize your ROI.',
    features: ['Landing Pages', 'Email Sequences', 'A/B Testing', 'Analytics'],
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'User-centered design that creates intuitive and delightful digital experiences.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Code2,
    title: 'Custom Animations & 3D',
    description: 'Advanced interactions and 3D elements that make your brand stand out from the crowd.',
    features: ['GSAP Animations', 'Three.js', 'WebGL Effects', 'Scroll Magic'],
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Blazing-fast websites that rank higher on Google and provide better user experiences.',
    features: ['Core Web Vitals', 'Lazy Loading', 'Code Splitting', 'CDN Setup'],
    gradient: 'from-yellow-500/20 to-amber-500/20',
  },
  {
    icon: BarChart,
    title: 'Conversion Rate Optimization',
    description: 'Data-driven strategies to increase conversions and generate more revenue from traffic.',
    features: ['Analytics Setup', 'Heat Mapping', 'User Testing', 'A/B Testing'],
    gradient: 'from-indigo-500/20 to-violet-500/20',
  },
];

const ServiceCard: React.FC<{ service: typeof services[0]; index: number }> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-background border border-border/50 overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8 }}
    >
      {/* Gradient background on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      
      {/* Content */}
      <div className="relative p-8 md:p-10 h-full flex flex-col">
        {/* Number & Icon Row */}
        <div className="flex items-start justify-between mb-8">
          <motion.div
            className="w-16 h-16 flex items-center justify-center border border-border group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <service.icon className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors duration-500" />
          </motion.div>
          <span className="text-[100px] font-display font-bold text-foreground/[0.03] leading-none select-none -mt-4 -mr-2 group-hover:text-accent/10 transition-colors duration-500">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-display font-bold mb-4 group-hover:text-accent transition-colors duration-500">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-8 font-body leading-relaxed flex-grow">
          {service.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {service.features.map((feature, i) => (
            <motion.span
              key={i}
              className="text-xs px-3 py-1.5 bg-secondary/50 text-muted-foreground group-hover:bg-accent/10 group-hover:text-foreground transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              {feature}
            </motion.span>
          ))}
        </div>

        {/* Learn More Link */}
        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-accent transition-colors"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: 'left' }}
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
    <section ref={containerRef} id="services" className="relative py-32 md:py-48 bg-secondary noise overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 right-[10%] w-64 h-64 border border-accent/20 rounded-full"
        style={{ y }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-[5%] w-48 h-48 bg-accent/5 rounded-full blur-[80px]"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Services
              <span className="w-12 h-px bg-accent" />
            </span>
          </RevealOnScroll>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-display font-bold leading-[0.85]">
            <KineticText text="WHAT I" type="words" animation="fade-up" delay={0.1} />
            <span className="text-accent ml-4">
              <KineticText text="DO" type="words" animation="fade-up" delay={0.3} />
            </span>
          </h2>
          <RevealOnScroll delay={0.4}>
            <p className="max-w-2xl mx-auto mt-8 text-lg text-muted-foreground font-body">
              Comprehensive digital solutions designed to elevate your brand 
              and drive measurable results.
            </p>
          </RevealOnScroll>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll delay={0.5}>
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
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default Services;

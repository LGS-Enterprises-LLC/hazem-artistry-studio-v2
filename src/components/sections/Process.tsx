import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Search, Palette, Code2, Rocket, HeartHandshake, ArrowRight, Check } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import KineticText from '@/components/KineticText';
import MagneticElement from '@/components/MagneticElement';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery',
    description: 'Deep dive into your business, goals, audience, and competitors to understand what makes you unique.',
    deliverables: ['Business Analysis', 'Competitor Research', 'User Personas', 'Project Roadmap'],
    duration: '1-2 weeks',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Strategy & Design',
    description: 'Develop a comprehensive design strategy that aligns with your brand and optimizes for conversions.',
    deliverables: ['Wireframes', 'Visual Design', 'Prototype', 'Design System'],
    duration: '2-3 weeks',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Development',
    description: 'Build your website using cutting-edge technology with a focus on performance and user experience.',
    deliverables: ['Frontend Code', 'CMS Integration', 'Animations', 'Testing'],
    duration: '3-4 weeks',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch & Optimize',
    description: 'Deploy your site, monitor performance, and continuously optimize based on real user data.',
    deliverables: ['Deployment', 'Analytics Setup', 'SEO Optimization', 'Performance Audit'],
    duration: '1 week',
  },
  {
    number: '05',
    icon: HeartHandshake,
    title: 'Ongoing Support',
    description: 'Provide ongoing maintenance, updates, and strategic guidance to keep your site performing at its best.',
    deliverables: ['Monthly Updates', 'Security Patches', 'Performance Reports', 'Priority Support'],
    duration: 'Ongoing',
  },
];

const ProcessStep: React.FC<{ step: typeof steps[0]; index: number; isLast: boolean }> = ({ step, index, isLast }) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stepRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={stepRef}
      className="relative group"
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Connection line */}
      {!isLast && (
        <motion.div
          className="absolute left-6 top-20 bottom-0 w-px bg-border"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
          style={{ transformOrigin: 'top' }}
        />
      )}

      <div className="flex gap-8 pb-16">
        {/* Step number circle */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-12 h-12 flex items-center justify-center bg-background border-2 border-border group-hover:border-accent group-hover:bg-accent transition-all duration-500 z-10 relative"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-sm font-display font-bold group-hover:text-accent-foreground transition-colors">
              {step.number}
            </span>
          </motion.div>
          
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 border-2 border-accent/50 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1.5, opacity: [0, 0.5, 0] } : {}}
            transition={{ duration: 2, delay: 0.5 + index * 0.15, repeat: Infinity, repeatDelay: 3 }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 p-6 md:p-8 border border-border/50 bg-background/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-500 group-hover:bg-secondary/30">
            {/* Left side */}
            <div className="flex-1">
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-accent transition-colors"
                  whileHover={{ rotate: 10 }}
                >
                  <step.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">{step.duration}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground font-body leading-relaxed max-w-xl">
                {step.description}
              </p>
            </div>

            {/* Right side - Deliverables */}
            <div className="lg:w-64 flex-shrink-0">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Deliverables</span>
              <ul className="space-y-2">
                {step.deliverables.map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-2 text-sm font-body"
                    initial={{ opacity: 0, x: 10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
                  >
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Process: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} id="process" className="relative py-32 md:py-48 noise overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]"
        style={{ y }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Process
              <span className="w-12 h-px bg-accent" />
            </span>
          </RevealOnScroll>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-display font-bold leading-[0.85]">
            <KineticText text="HOW I" type="words" animation="fade-up" delay={0.1} />
            <span className="text-stroke ml-4">
              <KineticText text="WORK" type="words" animation="fade-up" delay={0.3} />
            </span>
          </h2>
          <RevealOnScroll delay={0.4}>
            <p className="max-w-2xl mx-auto mt-8 text-lg text-muted-foreground font-body">
              A proven methodology refined over years of working with ambitious brands.
              Every project follows this battle-tested process.
            </p>
          </RevealOnScroll>
        </div>

        {/* Process Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ProcessStep 
              key={index} 
              step={step} 
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll delay={0.6}>
          <div className="text-center mt-16 md:mt-24 py-16 border-t border-border/30">
            <p className="text-xl text-muted-foreground mb-8 font-body">
              Ready to start your project?
            </p>
            <MagneticElement
              as="a"
              href="#contact"
              className="inline-flex items-center gap-4 px-12 py-6 bg-accent text-accent-foreground font-display font-bold text-lg tracking-wider hover:scale-105 transition-transform"
              strength={0.3}
            >
              LET'S TALK
              <ArrowRight className="w-5 h-5" />
            </MagneticElement>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default Process;

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Search, Palette, Code2, Rocket, HeartHandshake, Check, MousePointer2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import MagneticElement from '@/components/MagneticElement';
import { ArrowRight } from 'lucide-react';
import FluidPaintCanvas from '@/components/FluidPaintCanvas';

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
      initial={{ opacity: 0, x: -80 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Connection line with animation */}
      {!isLast && (
        <motion.div
          className="absolute left-6 top-24 bottom-0 w-px bg-gradient-to-b from-accent via-border to-border"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
          style={{ transformOrigin: 'top' }}
        />
      )}

      <div className="flex gap-8 pb-16">
        {/* Step number circle */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-12 h-12 flex items-center justify-center bg-background border-2 border-border group-hover:border-accent group-hover:bg-accent transition-all duration-500 z-10 relative"
            whileHover={{ scale: 1.15, rotate: 5 }}
          >
            <span className="text-sm font-display font-bold group-hover:text-accent-foreground transition-colors">
              {step.number}
            </span>
          </motion.div>

          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 border-2 border-accent"
            initial={{ scale: 1, opacity: 0 }}
            animate={isInView ? {
              scale: [1, 2, 2],
              opacity: [0, 0.5, 0],
            } : {}}
            transition={{ duration: 2, delay: 0.5 + index * 0.2, repeat: Infinity, repeatDelay: 4 }}
          />
        </div>

        {/* Content */}
        <motion.div
          className="flex-1 p-8 md:p-10 border border-border/50 bg-background/90 backdrop-blur-sm group-hover:border-accent/50 group-hover:bg-secondary/30 transition-all duration-500 relative z-10"
          whileHover={{ x: 10 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left side */}
            <div className="flex-1">
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-14 h-14 flex items-center justify-center border border-border group-hover:border-accent group-hover:bg-accent/10 transition-all"
                  whileHover={{ rotate: 10 }}
                >
                  <step.icon className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <motion.span
                    className="text-xs text-muted-foreground px-3 py-1 bg-secondary/50 inline-block mt-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {step.duration}
                  </motion.span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground font-body leading-relaxed max-w-xl text-lg">
                {step.description}
              </p>
            </div>

            {/* Right side - Deliverables */}
            <div className="lg:w-72 flex-shrink-0 p-6 bg-secondary/30 border border-border/30">
              <span className="text-xs uppercase tracking-wider text-accent mb-4 block font-display">
                Deliverables
              </span>
              <ul className="space-y-3">
                {step.deliverables.map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 text-sm font-body"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
                  >
                    <motion.div
                      className="w-5 h-5 flex items-center justify-center bg-accent/20 text-accent"
                      whileHover={{ scale: 1.2, rotate: 180 }}
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                    <span className="text-foreground/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Process: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px 0px 0px 0px" });
  const [hasInteracted, setHasInteracted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative py-32 md:py-48 overflow-hidden"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      {/* Background Elements - Unmount when out of view */}
      {isInView && (
        <>
          <FluidPaintCanvas
            className="z-0 pointer-events-auto"
            colors={['#ff0000', '#ff3333', '#cc0000', '#ff6666', '#990000']}
            particleSize={45}
            fadeSpeed={0.015}
            trailLength={16}
            glowIntensity={1.4}
            maxParticles={250}
          />

          <div className="absolute inset-0 grid-pattern opacity-10 z-[1] pointer-events-none" />
          <div className="absolute inset-0 noise pointer-events-none z-[2]" />

          <motion.div
            className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[200px] z-[1] pointer-events-none"
            style={{ y }}
          />
        </>
      )}

      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <ScrollReveal animation="fade-up">
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Process
              <span className="w-12 h-px bg-accent" />
            </span>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.1}>
            <h2 className="text-[clamp(3rem,10vw,8rem)] font-display font-black leading-[0.85] tracking-tighter">
              HOW I <span className="text-stroke-thick">WORK</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.2}>
            <p className="max-w-2xl mx-auto mt-8 text-lg text-muted-foreground font-body">
              A proven methodology refined over years of working with ambitious brands.
              Every project follows this battle-tested process.
            </p>
          </ScrollReveal>

          {/* Interactive hint */}
          <ScrollReveal animation="fade-up" delay={0.3}>
            <motion.div
              className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-sm font-body pointer-events-auto"
              animate={hasInteracted ? { opacity: 0, y: -10 } : { opacity: [0.5, 1, 0.5] }}
              transition={hasInteracted ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
            >
              <MousePointer2 className="w-4 h-4" />
              <span>Click and drag to paint</span>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Process Steps */}
        <div className="max-w-5xl mx-auto pointer-events-auto">
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
        <ScrollReveal animation="fade-up" delay={0.6}>
          <div className="text-center mt-16 md:mt-24 py-16 border-t border-border/30 pointer-events-auto">
            <motion.p
              className="text-2xl text-muted-foreground mb-8 font-body"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Ready to start your project?
            </motion.p>
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
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Process;

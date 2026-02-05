import React from 'react';
import { motion } from 'framer-motion';
import { Search, Palette, Code2, Rocket, HeartHandshake, ArrowRight } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import SplitText from '@/components/SplitText';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery',
    description: 'Deep dive into your business, goals, audience, and competitors to understand what makes you unique.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Strategy & Design',
    description: 'Develop a comprehensive design strategy that aligns with your brand and optimizes for conversions.',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Development',
    description: 'Build your website using cutting-edge technology with a focus on performance and user experience.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch & Optimize',
    description: 'Deploy your site, monitor performance, and continuously optimize based on real user data.',
  },
  {
    number: '05',
    icon: HeartHandshake,
    title: 'Ongoing Support',
    description: 'Provide ongoing maintenance, updates, and strategic guidance to keep your site performing at its best.',
  },
];

const Process: React.FC = () => {
  return (
    <section id="process" className="relative py-32 md:py-48 noise">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Process
              <span className="w-12 h-px bg-accent" />
            </span>
          </RevealOnScroll>
          <h2 className="text-mega font-display">
            <SplitText text="HOW I" delay={0.1} />
            <span className="text-stroke ml-4">
              <SplitText text="WORK" delay={0.3} />
            </span>
          </h2>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <RevealOnScroll key={index} delay={index * 0.15}>
              <motion.div
                className="process-step relative group"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Number */}
                <div className="absolute left-0 -translate-x-1/2 -translate-y-0 w-12 h-12 flex items-center justify-center bg-background border border-border group-hover:border-accent group-hover:bg-accent transition-all">
                  <span className="text-sm font-display font-bold group-hover:text-accent-foreground">
                    {step.number}
                  </span>
                </div>

                <div className="pl-6 pb-4">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <step.icon className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-display font-bold group-hover:text-accent transition-colors">
                      {step.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground font-body leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll delay={0.6}>
          <div className="text-center mt-20">
            <p className="text-lg text-muted-foreground mb-8 font-body">
              Ready to start your project?
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-accent text-accent-foreground font-display font-semibold tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              LET'S TALK
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default Process;

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Lightbulb, Palette, Code, Rocket, HeartHandshake } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We dive deep into your goals, audience, and vision to understand exactly what success looks like.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'I craft a comprehensive plan covering architecture, design direction, and technical requirements.',
    icon: Lightbulb,
  },
  {
    number: '03',
    title: 'Design',
    description: 'Beautiful mockups that bring your vision to life with meticulous attention to every detail.',
    icon: Palette,
  },
  {
    number: '04',
    title: 'Development',
    description: 'Clean, performant code built with modern technologies and best practices.',
    icon: Code,
  },
  {
    number: '05',
    title: 'Launch',
    description: 'Rigorous testing, optimization, and seamless deployment to get you live.',
    icon: Rocket,
  },
  {
    number: '06',
    title: 'Support',
    description: 'Ongoing maintenance and improvements to keep your digital presence thriving.',
    icon: HeartHandshake,
  },
];

const Process: React.FC = () => {
  return (
    <section id="process" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
              Process
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              How We <span className="text-gradient">Work</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              A proven methodology that delivers exceptional results, every time.
            </p>
          </FadeIn>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={0.1 + index * 0.1}>
              <motion.div
                className="group relative"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative p-8 rounded-2xl bg-card border border-border/50 h-full hover:border-accent/30 transition-colors duration-300">
                  {/* Step Number */}
                  <span className="absolute -top-4 -left-2 font-display font-bold text-6xl text-accent/10 group-hover:text-accent/20 transition-colors">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="relative w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="relative font-display font-bold text-xl mb-3 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <p className="relative text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Line (except last in row) */}
                {index % 3 !== 2 && index !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-border to-transparent" />
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

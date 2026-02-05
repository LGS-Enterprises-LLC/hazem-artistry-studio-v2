import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layers, Zap, Sparkles, Target, Palette } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

const services = [
  {
    icon: Code,
    title: 'Web Design & Development',
    description: 'Custom websites built with cutting-edge technology that look stunning and perform flawlessly.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Target,
    title: 'Sales Funnel Design',
    description: 'High-converting funnels strategically designed to turn visitors into customers and maximize ROI.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Sparkles,
    title: 'Custom Animations & 3D',
    description: 'Advanced interactions and immersive 3D elements that create unforgettable user experiences.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Lightning-fast websites that rank higher, convert better, and delight users on every device.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Palette,
    title: 'Brand & UI Design',
    description: 'Cohesive visual identities and interface design that communicate your brand\'s unique story.',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    icon: Layers,
    title: 'Full-Stack Development',
    description: 'End-to-end solutions from frontend to backend, databases to deployments, all seamlessly integrated.',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-brand-purple/5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
              Services
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              What I <span className="text-gradient">Do Best</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              From concept to launch, I provide comprehensive web solutions 
              that elevate your digital presence.
            </p>
          </FadeIn>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={0.1 + index * 0.1}>
              <motion.div
                className="group relative p-8 rounded-2xl bg-card border border-border/50 card-hover h-full"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="relative font-display font-bold text-xl mb-3 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Hover Line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-brand-purple rounded-b-2xl"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

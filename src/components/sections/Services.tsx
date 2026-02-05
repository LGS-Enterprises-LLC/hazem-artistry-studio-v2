import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Rocket, Palette, Zap, Monitor, BarChart } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import SplitText from '@/components/SplitText';

const services = [
  {
    icon: Monitor,
    title: 'Web Design & Development',
    description: 'Custom websites built with cutting-edge technology that look stunning and perform flawlessly.',
    features: ['Custom Design', 'Responsive', 'Fast Loading'],
  },
  {
    icon: Rocket,
    title: 'Sales Funnel Creation',
    description: 'High-converting funnels designed to turn visitors into customers and maximize your ROI.',
    features: ['Landing Pages', 'Conversion Optimized', 'A/B Testing'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'User-centered design that creates intuitive and delightful digital experiences.',
    features: ['User Research', 'Prototyping', 'Design Systems'],
  },
  {
    icon: Code2,
    title: 'Custom Animations & 3D',
    description: 'Advanced interactions and 3D elements that make your brand stand out from the crowd.',
    features: ['GSAP Animations', 'Three.js', 'WebGL'],
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Blazing-fast websites that rank higher on Google and provide better user experiences.',
    features: ['Core Web Vitals', 'SEO', 'Speed Optimization'],
  },
  {
    icon: BarChart,
    title: 'Conversion Rate Optimization',
    description: 'Data-driven strategies to increase conversions and generate more revenue from existing traffic.',
    features: ['Analytics', 'Heat Mapping', 'User Testing'],
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="relative py-32 md:py-48 bg-secondary noise">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-accent" />
              Services
              <span className="w-12 h-px bg-accent" />
            </span>
          </RevealOnScroll>
          <h2 className="text-mega font-display">
            <SplitText text="WHAT I" delay={0.1} />
            <span className="text-accent ml-4">
              <SplitText text="DO" delay={0.3} />
            </span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((service, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <motion.div
                className="service-card group h-full bg-background"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <div className="relative mb-8">
                  <motion.div
                    className="w-16 h-16 flex items-center justify-center border border-border group-hover:border-accent transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <service.icon className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors" />
                  </motion.div>
                  {/* Number */}
                  <span className="absolute -top-2 -right-2 text-[80px] font-display font-bold text-foreground/5 leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 font-body leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {service.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 bg-secondary text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Hover Indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-accent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

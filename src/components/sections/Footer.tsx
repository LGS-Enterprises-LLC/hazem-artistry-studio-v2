import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import TextMarquee from '@/components/TextMarquee';
import MagneticElement from '@/components/MagneticElement';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'Dribbble', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Behance', href: '#' },
  ];

  return (
    <footer ref={footerRef} className="relative bg-background noise overflow-hidden">
      {/* Large CTA Section */}
      <motion.div 
        className="border-y border-border py-16 md:py-24 overflow-hidden"
        style={{ y, opacity }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h2
            className="text-[clamp(2rem,8vw,6rem)] font-display font-bold leading-[0.85] mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            HAVE A PROJECT IN
            <br />
            <span className="text-accent">MIND?</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <MagneticElement
              as="a"
              href="#contact"
              className="inline-flex items-center gap-4 px-12 py-6 bg-accent text-accent-foreground font-display font-bold text-lg tracking-wider hover:scale-105 transition-transform"
              strength={0.3}
            >
              LET'S TALK
              <ArrowUpRight className="w-6 h-6" />
            </MagneticElement>
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="border-b border-border py-6 md:py-8 overflow-hidden bg-secondary/30">
        <TextMarquee
          text="LET'S WORK TOGETHER • WORLD-CLASS DESIGN"
          className="text-[60px] md:text-[100px] font-display font-bold text-foreground/[0.03]"
          speed={30}
          separator="✦"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.h3 
              className="text-3xl md:text-4xl font-display font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              HAZEM MAGDY
            </motion.h3>
            <motion.p 
              className="text-muted-foreground font-body mb-8 max-w-md text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Elite web design agency crafting digital experiences that make jaws drop and generate millions for ambitious brands.
            </motion.p>
            
            {/* Contact info */}
            <motion.div 
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <a href="mailto:hello@hazemmagdy.com" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors group">
                <Mail className="w-4 h-4" />
                <span className="font-body">hello@hazemmagdy.com</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="font-body">Available Worldwide • Remote</span>
              </div>
            </motion.div>
            
            {/* Availability Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-5 py-3 border border-success/30 bg-success/5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
              <span className="text-sm font-body text-success">Currently accepting projects</span>
            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 font-body">
              Navigation
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-body"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 font-body">
              Connect
            </h4>
            <ul className="space-y-4">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-body"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-6 mt-16 md:mt-24 pt-8 border-t border-border/30"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-muted-foreground font-body">
            © {currentYear} Hazem Magdy. All rights reserved. Crafted with ❤️
          </p>

          {/* Back to Top */}
          <MagneticElement
            as="button"
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            strength={0.2}
          >
            Back to top
            <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-accent group-hover:bg-accent transition-all">
              <ArrowUp className="w-5 h-5 group-hover:text-accent-foreground transition-colors" />
            </div>
          </MagneticElement>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

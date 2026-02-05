import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import TextMarquee from '@/components/TextMarquee';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'Dribbble', href: '#' },
    { label: 'Instagram', href: '#' },
  ];

  return (
    <footer className="relative bg-background noise">
      {/* Top Marquee */}
      <div className="border-y border-border py-8 overflow-hidden">
        <TextMarquee
          text="LET'S WORK TOGETHER"
          className="text-[80px] md:text-[120px] font-display font-bold text-foreground/5"
          speed={40}
          separator="✦"
        />
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">HAZEM MAGDY</h3>
            <p className="text-muted-foreground font-body mb-6 max-w-xs">
              Elite web design agency crafting digital experiences that make jaws drop.
            </p>
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-border">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-body text-muted-foreground">Available for projects</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-6 font-body">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-body"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-6 font-body">
              Connect
            </h4>
            <ul className="space-y-3">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-body"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground font-body">
            © {currentYear} Hazem Magdy. All rights reserved.
          </p>

          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ y: -2 }}
          >
            Back to top
            <div className="w-10 h-10 flex items-center justify-center border border-border group-hover:border-foreground group-hover:bg-foreground transition-all">
              <ArrowUp className="w-4 h-4 group-hover:text-background transition-colors" />
            </div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

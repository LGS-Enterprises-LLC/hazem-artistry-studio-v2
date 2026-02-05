import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import SplitText from '@/components/SplitText';
import MagneticElement from '@/components/MagneticElement';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const socials = [
    { name: 'LinkedIn', url: '#' },
    { name: 'Twitter', url: '#' },
    { name: 'Dribbble', url: '#' },
    { name: 'Instagram', url: '#' },
  ];

  return (
    <section id="contact" className="relative py-32 md:py-48 bg-secondary noise">
      {/* Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column */}
          <div>
            <RevealOnScroll>
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                <span className="w-12 h-px bg-accent" />
                Contact
              </span>
            </RevealOnScroll>
            <h2 className="text-mega font-display mb-8">
              <SplitText text="LET'S BUILD" delay={0.1} />
              <br />
              <span className="text-accent">
                <SplitText text="SOMETHING" delay={0.3} />
              </span>
              <br />
              <SplitText text="INCREDIBLE" delay={0.5} />
            </h2>

            <RevealOnScroll delay={0.4}>
              <p className="text-lg text-muted-foreground mb-12 font-body max-w-md">
                Ready to take your digital presence to the next level? 
                Let's discuss your project and make it happen.
              </p>
            </RevealOnScroll>

            {/* Contact Info */}
            <div className="space-y-6 mb-12">
              <RevealOnScroll delay={0.5}>
                <a href="mailto:hello@hazemmagdy.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-accent transition-colors">
                    <Mail className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <span className="text-lg font-body group-hover:text-accent transition-colors">
                    hello@hazemmagdy.com
                  </span>
                </a>
              </RevealOnScroll>

              <RevealOnScroll delay={0.6}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-border">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-lg font-body text-muted-foreground">
                    Available Worldwide
                  </span>
                </div>
              </RevealOnScroll>
            </div>

            {/* Socials */}
            <RevealOnScroll delay={0.7}>
              <div className="flex flex-wrap gap-4">
                {socials.map((social, i) => (
                  <MagneticElement
                    key={i}
                    as="a"
                    href={social.url}
                    className="group px-6 py-3 border border-border hover:border-foreground hover:bg-foreground transition-all"
                    strength={0.3}
                  >
                    <span className="flex items-center gap-2 text-sm font-body group-hover:text-background transition-colors">
                      {social.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </span>
                  </MagneticElement>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column - Form */}
          <RevealOnScroll delay={0.3} direction="right">
            <div className="bg-background p-8 md:p-12 border border-border">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-accent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <Send className="w-8 h-8 text-accent-foreground" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold mb-4">Message Sent!</h3>
                  <p className="text-muted-foreground font-body">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-body">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-body">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-body">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formState.projectType}
                      onChange={handleChange}
                      className="form-input appearance-none bg-transparent"
                    >
                      <option value="">Select a project type</option>
                      <option value="website">Website Design</option>
                      <option value="funnel">Sales Funnel</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS Product</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-body">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formState.budget}
                      onChange={handleChange}
                      className="form-input appearance-none bg-transparent"
                    >
                      <option value="">Select a budget range</option>
                      <option value="5-10k">$5,000 - $10,000</option>
                      <option value="10-25k">$10,000 - $25,000</option>
                      <option value="25-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-body">
                      Project Details *
                    </label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="form-input resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-accent text-accent-foreground font-display font-semibold tracking-wider relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={`flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-0' : ''}`}>
                      SEND MESSAGE
                      <Send className="w-4 h-4" />
                    </span>
                    {isSubmitting && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Calendar, CheckCircle } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import MagneticButton from '@/components/MagneticButton';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <FadeIn>
              <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
                Get in Touch
              </span>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
                Let's Build Something{' '}
                <span className="text-gradient">Incredible</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Ready to transform your digital presence? Let's discuss your project 
                and create something extraordinary together.
              </p>
            </FadeIn>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <FadeIn delay={0.3} className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <motion.a
                  href="mailto:hello@hazemmagdy.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">hello@hazemmagdy.com</p>
                  </div>
                </motion.a>

                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">Available Worldwide</p>
                  </div>
                </motion.div>

                <motion.a
                  href="#"
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule</p>
                    <p className="font-medium text-foreground">Book a Call</p>
                  </div>
                </motion.a>
              </div>

              {/* Availability */}
              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-success">
                    Currently accepting new projects
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn delay={0.4} className="lg:col-span-3">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-card border border-border/50"
                >
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="projectType" className="text-sm font-medium text-muted-foreground">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formState.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground"
                      >
                        <option value="">Select a type</option>
                        <option value="website">Website Design</option>
                        <option value="funnel">Sales Funnel</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="webapp">Web Application</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="budget" className="text-sm font-medium text-muted-foreground">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formState.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground"
                      >
                        <option value="">Select budget</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k+">$50,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none text-foreground"
                      placeholder="Tell me about your project, goals, and vision..."
                    />
                  </div>

                  <MagneticButton
                    className="w-full px-8 py-4 bg-foreground text-background glow-button flex items-center justify-center gap-2"
                    strength={0.1}
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </MagneticButton>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

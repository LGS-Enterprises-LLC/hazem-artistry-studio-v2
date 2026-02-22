import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Send, MapPin, Mail, ArrowUpRight, CheckCircle2, MousePointer2 } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import KineticText from '@/components/KineticText';
import MagneticElement from '@/components/MagneticElement';
import FluidPaintCanvas from '@/components/FluidPaintCanvas';

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px 0px 0px 0px" });
  const formRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formRef, { once: true, margin: '-100px' });
  const [hasInteracted, setHasInteracted] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

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
    { name: 'LinkedIn', url: '#', icon: '→' },
    { name: 'Twitter', url: '#', icon: '→' },
    { name: 'Dribbble', url: '#', icon: '→' },
    { name: 'Instagram', url: '#', icon: '→' },
  ];

  const formFields = [
    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
  ];

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative py-32 md:py-48 bg-secondary noise overflow-hidden"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      {/* Background Elements - Unmount when out of view */}
      {isInView && (
        <>
          <FluidPaintCanvas
            className="z-0 pointer-events-auto"
            colors={['#06b6d4', '#22d3ee', '#0891b2', '#67e8f9', '#0e7490']}
            particleSize={45}
            fadeSpeed={0.015}
            trailLength={16}
            glowIntensity={1.4}
            maxParticles={250}
          />

          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#06b6d4]/5 to-transparent pointer-events-none"
            style={{ y }}
          />

          <motion.div
            className="absolute -bottom-[400px] -right-[400px] w-[800px] h-[800px] border border-[#06b6d4]/10 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              <span className="w-12 h-px bg-[#06b6d4]" />
              Get In Touch
              <span className="w-12 h-px bg-[#06b6d4]" />
            </span>
          </RevealOnScroll>
          <h2 className="text-[clamp(2rem,8vw,6rem)] font-display font-bold leading-[0.85]">
            <KineticText text="LET'S BUILD" type="words" animation="fade-up" delay={0.1} />
            <br />
            <span className="text-[#06b6d4]">
              <KineticText text="SOMETHING" type="words" animation="fade-up" delay={0.3} />
            </span>
            <br />
            <KineticText text="INCREDIBLE" type="words" animation="fade-up" delay={0.5} />
          </h2>

          {/* Interactive hint */}
          <motion.div
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-sm font-body pointer-events-auto"
            animate={hasInteracted ? { opacity: 0, y: -10 } : { opacity: [0.5, 1, 0.5] }}
            transition={hasInteracted ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
          >
            <MousePointer2 className="w-4 h-4" />
            <span>Click and drag to paint</span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 pointer-events-auto">
          {/* Left Column - Info */}
          <div className="lg:col-span-2">
            <RevealOnScroll delay={0.2}>
              <p className="text-xl text-muted-foreground mb-12 font-body leading-relaxed">
                Ready to take your digital presence to the next level?
                Let's discuss your project and create something extraordinary together.
              </p>
            </RevealOnScroll>

            {/* Contact Info */}
            <div className="space-y-6 mb-12">
              <RevealOnScroll delay={0.3}>
                <motion.a
                  href="mailto:hello@hazemmagdy.com"
                  className="flex items-center gap-4 group p-4 -mx-4 hover:bg-background/50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-border group-hover:border-[#06b6d4] group-hover:bg-[#06b6d4] transition-all">
                    <Mail className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Email</span>
                    <span className="text-lg font-body group-hover:text-[#06b6d4] transition-colors">
                      Hazem.entrepreneur@gmail.com
                    </span>
                  </div>
                </motion.a>
              </RevealOnScroll>

              <RevealOnScroll delay={0.4}>
                <motion.div
                  className="flex items-center gap-4 p-4 -mx-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-border">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Location</span>
                    <span className="text-lg font-body text-muted-foreground">
                      Available Worldwide • Remote
                    </span>
                  </div>
                </motion.div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.5}>
                <motion.div
                  className="flex items-center gap-4 p-4 -mx-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-success bg-success/10">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Availability</span>
                    <span className="text-lg font-body text-success">
                      Currently accepting projects
                    </span>
                  </div>
                </motion.div>
              </RevealOnScroll>
            </div>

            {/* Socials */}
            <RevealOnScroll delay={0.6}>
              <div className="border-t border-border pt-8">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-6">Follow Me</span>
                <div className="flex flex-wrap gap-3">
                  {socials.map((social, i) => (
                    <MagneticElement
                      key={i}
                      as="a"
                      href={social.url}
                      className="group px-6 py-3 border border-border hover:border-[#06b6d4] hover:bg-[#06b6d4] transition-all"
                      strength={0.3}
                    >
                      <span className="flex items-center gap-2 text-sm font-body group-hover:text-white transition-colors">
                        {social.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </span>
                    </MagneticElement>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column - Form */}
          <div ref={formRef} className="lg:col-span-3">
            <motion.div
              className="bg-background/90 backdrop-blur-sm p-8 md:p-12 border border-border relative overflow-hidden"
              initial={{ opacity: 0, y: 60 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#06b6d4]/30" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#06b6d4]/30" />

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="w-24 h-24 mx-auto mb-8 flex items-center justify-center bg-[#06b6d4]"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.h3
                    className="text-3xl font-display font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Message Sent!
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground font-body text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </motion.p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 h-full">
                  {/* WhatsApp CTA */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <MagneticElement
                      as="a"
                      href="https://wa.me/201000906903?text=I'd%20like%20to%20book%20a%20demo%20to%20build%20my%20dream%20website"
                      className="inline-flex items-center gap-4 px-10 md:px-14 py-6 md:py-8 bg-[#25D366] text-white font-display font-bold text-xl md:text-2xl tracking-wider rounded-full hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
                      strength={0.2}
                    >
                      <span>Build Your Dream Website</span>
                      <Send className="w-6 h-6" />
                    </MagneticElement>
                  </motion.div>
                  <motion.p
                    className="mt-8 text-muted-foreground font-body text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Clicking the button will open a pre-filled WhatsApp message.
                  </motion.p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

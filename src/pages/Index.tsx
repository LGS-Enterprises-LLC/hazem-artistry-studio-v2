import { useState, useCallback, Suspense, lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import AdvancedCursor from '@/components/AdvancedCursor';
import Preloader from '@/components/Preloader';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';

const isTouchDevice = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

// Lazy load all below-the-fold sections
const About = lazy(() => import('@/components/sections/About'));
const Portfolio = lazy(() => import('@/components/sections/Portfolio'));
const Services = lazy(() => import('@/components/sections/Services'));
const TechStack = lazy(() => import('@/components/sections/TechStack'));
const Testimonials = lazy(() => import('@/components/sections/Testimonials'));
const Process = lazy(() => import('@/components/sections/Process'));
const Contact = lazy(() => import('@/components/sections/Contact'));
const Footer = lazy(() => import('@/components/sections/Footer'));

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  useSmoothScroll();

  const handlePreloaderComplete = useCallback(() => setIsLoading(false), []);

  return (
    // MotionConfig: use CSS transitions where possible, shorter durations
    <MotionConfig reducedMotion="user" transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
      <>
        {isLoading && (
          <Preloader
            onComplete={handlePreloaderComplete}
            duration={isTouchDevice ? 0.8 : 2.5}
          />
        )}

        <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
          {!isTouchDevice && <AdvancedCursor />}
          <ScrollProgress />
          <Navbar />

          <main>
            <Hero />
            <Suspense fallback={<div className="min-h-screen" />}>
              <About />
              <Portfolio />
              <Services />
              <TechStack />
              <Testimonials />
              <Process />
              <Contact />
            </Suspense>
          </main>

          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>
      </>
    </MotionConfig>
  );
};

export default Index;

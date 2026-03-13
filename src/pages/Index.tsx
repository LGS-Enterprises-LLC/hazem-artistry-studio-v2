import { useState, useCallback, Suspense, lazy } from 'react';
import useSmoothScroll from '@/hooks/useSmoothScroll';

const isTouchDevice = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);
import AdvancedCursor from '@/components/AdvancedCursor';
import Preloader from '@/components/Preloader';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';

// Removed DynamicGradient and FloatingElements - too heavy for minimal visual impact

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

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {/* Cinematic Preloader — fast on mobile */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} duration={isTouchDevice ? 0.8 : 2.5} />}
      
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Advanced Cursor — desktop only (AdvancedCursor self-guards but skip render entirely on mobile) */}
        {!isTouchDevice && <AdvancedCursor />}
        
        {/* Scroll Progress Indicator */}
        <ScrollProgress />
        
        <Navbar />
        
        {/* Non-lazy Hero section to ensure LCP is instantly rendered */}
        <main>
          <Hero />
          
          <Suspense fallback={<div className="min-h-screen" />}>

            {/* Content Sections */}
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
  );
};

export default Index;


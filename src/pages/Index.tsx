import { useState, useCallback, Suspense, lazy } from 'react';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import AdvancedCursor from '@/components/AdvancedCursor';
import Preloader from '@/components/Preloader';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';

// Wrap the background components in lazy loading as well, slightly deferred
const DynamicGradient = lazy(() => import('@/components/DynamicGradient'));
const FloatingElements = lazy(() => import('@/components/FloatingElements'));

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
      {/* Cinematic Preloader */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} duration={2.5} />}
      
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Advanced Cursor with trail effects */}
        <AdvancedCursor />
        
        {/* Scroll Progress Indicator */}
        <ScrollProgress />
        
        <Navbar />
        
        {/* Non-lazy Hero section to ensure LCP is instantly rendered */}
        <main>
          <Hero />
          
          <Suspense fallback={<div className="min-h-screen" />}>
            {/* Background elements load after Hero */}
            <DynamicGradient 
              colors={['hsl(0, 100%, 50%)', 'hsl(280, 100%, 40%)', 'hsl(0, 100%, 50%)']} 
              opacity={0.08}
            />
            <FloatingElements />

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


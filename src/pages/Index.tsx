import { useState, useCallback } from 'react';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import AdvancedCursor from '@/components/AdvancedCursor';
import Preloader from '@/components/Preloader';
import ScrollProgress from '@/components/ScrollProgress';
import DynamicGradient from '@/components/DynamicGradient';
import FloatingElements from '@/components/FloatingElements';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Portfolio from '@/components/sections/Portfolio';
import Services from '@/components/sections/Services';
import TechStack from '@/components/sections/TechStack';
import Testimonials from '@/components/sections/Testimonials';
import Process from '@/components/sections/Process';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

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
        
        {/* Dynamic gradient background that moves with scroll */}
        <DynamicGradient 
          colors={['hsl(0, 100%, 50%)', 'hsl(280, 100%, 40%)', 'hsl(0, 100%, 50%)']} 
          opacity={0.08}
        />
        
        {/* Floating geometric elements */}
        <FloatingElements />
        
        <Navbar />
        
        <main>
          <Hero />
          <About />
          <Portfolio />
          <Services />
          <TechStack />
          <Testimonials />
          <Process />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;

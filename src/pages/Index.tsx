import useSmoothScroll from '@/hooks/useSmoothScroll';
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
  useSmoothScroll();

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
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
  );
};

export default Index;

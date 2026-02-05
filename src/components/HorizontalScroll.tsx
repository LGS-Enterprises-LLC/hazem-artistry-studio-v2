import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className = '',
  speed = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    
    if (!container || !scroller) return;

    const getScrollAmount = () => {
      return -(scroller.scrollWidth - window.innerWidth);
    };

    const tween = gsap.to(scroller, {
      x: getScrollAmount,
      duration: 3,
      ease: 'none',
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: () => `+=${Math.abs(getScrollAmount()) * speed}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    });

    // Refresh on resize
    const handleResize = () => {
      scrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollTrigger.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div 
        ref={scrollerRef} 
        className="flex flex-nowrap will-change-transform"
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;
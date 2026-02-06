import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  text: string | null;
  variant: 'default' | 'link' | 'button' | 'text' | 'media' | 'drag';
}

const AdvancedCursor: React.FC = () => {
  const [state, setState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    text: null,
    variant: 'default',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const outlineSpringConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const outlineXSpring = useSpring(cursorX, outlineSpringConfig);
  const outlineYSpring = useSpring(cursorY, outlineSpringConfig);

  useEffect(() => {
    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      // Add trail point
      trailIdRef.current += 1;
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailIdRef.current }];
        return newTrail.slice(-8); // Keep last 8 points
      });
    };

    const handleMouseDown = () => setState(prev => ({ ...prev, isClicking: true }));
    const handleMouseUp = () => setState(prev => ({ ...prev, isClicking: false }));
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      const isLink = target.closest('a');
      const isButton = target.closest('button, [role="button"]');
      const isMedia = target.closest('video, img, .project-card');
      const isDrag = target.closest('[data-cursor="drag"]');
      const cursorText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');

      if (isDrag) {
        setState(prev => ({ ...prev, isHovering: true, variant: 'drag', text: 'DRAG' }));
      } else if (cursorText) {
        setState(prev => ({ ...prev, isHovering: true, variant: 'text', text: cursorText }));
      } else if (isMedia) {
        setState(prev => ({ ...prev, isHovering: true, variant: 'media', text: 'VIEW' }));
      } else if (isButton) {
        setState(prev => ({ ...prev, isHovering: true, variant: 'button', text: null }));
      } else if (isLink) {
        setState(prev => ({ ...prev, isHovering: true, variant: 'link', text: null }));
      } else {
        setState(prev => ({ ...prev, isHovering: false, variant: 'default', text: null }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [cursorX, cursorY]);

  // Clean up old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getOutlineSize = () => {
    if (state.text) return 100;
    if (state.variant === 'button') return 80;
    if (state.variant === 'link') return 60;
    if (state.variant === 'media') return 120;
    if (state.isClicking) return 30;
    return 48;
  };

  const getDotSize = () => {
    if (state.isClicking) return 4;
    if (state.isHovering) return 0;
    return 8;
  };

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Trail effect */}
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9997] rounded-full mix-blend-difference"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              left: point.x,
              top: point.y,
              width: 4,
              height: 4,
              backgroundColor: 'white',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-foreground mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          width: getDotSize(),
          height: getDotSize(),
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Cursor outline */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border mix-blend-difference flex items-center justify-center"
        style={{
          left: outlineXSpring,
          top: outlineYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          width: getOutlineSize(),
          height: getOutlineSize(),
          borderColor: state.isHovering ? 'hsl(var(--accent))' : 'rgba(255,255,255,0.5)',
          backgroundColor: state.text ? 'hsl(var(--accent))' : 'transparent',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <AnimatePresence mode="wait">
          {state.text && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[10px] font-display font-bold tracking-wider text-accent-foreground"
            >
              {state.text}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AdvancedCursor;

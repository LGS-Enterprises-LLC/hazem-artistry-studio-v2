import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'zoom-in' 
  | 'zoom-out'
  | 'flip-up'
  | 'flip-left'
  | 'blur-in'
  | 'slide-up'
  | 'reveal-up'
  | 'stagger-fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  staggerChildren?: number;
}

const getVariants = (animation: AnimationType): Variants => {
  switch (animation) {
    case 'fade-up':
      return {
        hidden: { opacity: 0, y: 80 },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade-down':
      return {
        hidden: { opacity: 0, y: -80 },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade-left':
      return {
        hidden: { opacity: 0, x: -80 },
        visible: { opacity: 1, x: 0 },
      };
    case 'fade-right':
      return {
        hidden: { opacity: 0, x: 80 },
        visible: { opacity: 1, x: 0 },
      };
    case 'zoom-in':
      return {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      };
    case 'zoom-out':
      return {
        hidden: { opacity: 0, scale: 1.2 },
        visible: { opacity: 1, scale: 1 },
      };
    case 'flip-up':
      return {
        hidden: { opacity: 0, rotateX: 90, transformPerspective: 1000 },
        visible: { opacity: 1, rotateX: 0, transformPerspective: 1000 },
      };
    case 'flip-left':
      return {
        hidden: { opacity: 0, rotateY: -90, transformPerspective: 1000 },
        visible: { opacity: 1, rotateY: 0, transformPerspective: 1000 },
      };
    case 'blur-in':
      return {
        hidden: { opacity: 0, filter: 'blur(20px)' },
        visible: { opacity: 1, filter: 'blur(0px)' },
      };
    case 'slide-up':
      return {
        hidden: { y: '100%' },
        visible: { y: 0 },
      };
    case 'reveal-up':
      return {
        hidden: { clipPath: 'inset(100% 0 0 0)' },
        visible: { clipPath: 'inset(0% 0 0 0)' },
      };
    case 'stagger-fade':
      return {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      };
    default:
      return {
        hidden: { opacity: 0, y: 80 },
        visible: { opacity: 1, y: 0 },
      };
  }
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.2,
  staggerChildren = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    margin: `-100px 0px 0px 0px`,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const variants = getVariants(animation);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
            staggerChildren: staggerChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
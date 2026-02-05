import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  animationType?: 'fade-up' | 'blur' | 'slide' | 'rotate';
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  animationType = 'fade-up',
}) => {
  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay * 3,
        delayChildren: delay,
      },
    },
  };

  const getWordVariants = (): Variants => {
    switch (animationType) {
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
          visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
          },
        };
      case 'slide':
        return {
          hidden: { x: -100, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
          },
        };
      case 'rotate':
        return {
          hidden: { rotateX: 90, opacity: 0, y: 50 },
          visible: {
            rotateX: 0,
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
          },
        };
      default:
        return {
          hidden: { opacity: 0, y: 60 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
          },
        };
    }
  };

  const wordVariants = getWordVariants();

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="split-parent mr-[0.3em]">
          <motion.span
            className="split-child inline-block"
            variants={wordVariants}
            style={{ transformOrigin: 'center bottom' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default SplitText;

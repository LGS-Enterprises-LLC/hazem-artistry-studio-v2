import React from 'react';
import { motion, Variants } from 'framer-motion';

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: 'chars' | 'words';
  animation?: 'fade-up' | 'blur' | 'scale' | 'rotate-3d' | 'scramble';
}

const KineticText: React.FC<KineticTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  type = 'chars',
  animation = 'fade-up',
}) => {
  const items = type === 'chars' ? text.split('') : text.split(' ');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const getItemVariants = (): Variants => {
    switch (animation) {
      case 'blur':
        return {
          hidden: { 
            opacity: 0, 
            filter: 'blur(20px)',
            y: 50,
          },
          visible: { 
            opacity: 1, 
            filter: 'blur(0px)',
            y: 0,
            transition: { 
              duration: 1,
              ease: [0.23, 1, 0.32, 1],
            },
          },
        };
      case 'scale':
        return {
          hidden: { 
            opacity: 0, 
            scale: 0,
          },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              type: 'spring',
              damping: 12,
              stiffness: 100,
            },
          },
        };
      case 'rotate-3d':
        return {
          hidden: { 
            opacity: 0, 
            rotateX: 90,
            y: 50,
          },
          visible: { 
            opacity: 1, 
            rotateX: 0,
            y: 0,
            transition: { 
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
            },
          },
        };
      case 'scramble':
        return {
          hidden: { 
            opacity: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            rotate: Math.random() * 90 - 45,
          },
          visible: { 
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            transition: { 
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
            },
          },
        };
      default: // fade-up
        return {
          hidden: { 
            opacity: 0, 
            y: 100,
          },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
            },
          },
        };
    }
  };

  const itemVariants = getItemVariants();

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {items.map((item, index) => (
        <span 
          key={index} 
          className="overflow-hidden"
          style={{ display: 'inline-block' }}
        >
          <motion.span
            className="inline-block"
            variants={itemVariants}
            style={{ 
              transformOrigin: 'center bottom',
              whiteSpace: item === ' ' ? 'pre' : 'normal',
            }}
          >
            {item === ' ' ? '\u00A0' : item}
            {type === 'words' && index < items.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default KineticText;

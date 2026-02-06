import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface VideoBackgroundProps {
  src?: string;
  fallbackImage?: string;
  className?: string;
  overlay?: boolean;
  parallax?: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  fallbackImage,
  className = '',
  overlay = true,
  parallax = true,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', parallax ? '30%' : '0%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, parallax ? 1.2 : 1]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-0"
        style={{ y, scale }}
      >
        {src ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={fallbackImage}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : fallbackImage ? (
          <img
            src={fallbackImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          // Animated gradient fallback
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 50%, hsl(var(--background)) 100%)',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </motion.div>

      {/* Overlay layers */}
      {overlay && (
        <>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
          
          {/* Noise overlay */}
          <div className="absolute inset-0 noise opacity-[0.03]" />
          
          {/* Vignette */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background)) 100%)',
            }}
          />
        </>
      )}
    </div>
  );
};

export default VideoBackground;

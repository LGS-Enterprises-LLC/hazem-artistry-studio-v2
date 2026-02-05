import React, { useEffect, useState, useRef } from 'react';
import { useMotionValue, animate, useInView } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  delay = 0,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        const animation = animate(count, value, {
          duration,
          ease: 'easeOut',
          onUpdate: (latest) => setDisplayValue(Math.round(latest)),
        });
        return () => animation.stop();
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, duration, delay, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

export default Counter;

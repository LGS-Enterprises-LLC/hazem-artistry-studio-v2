import React, { useRef, useEffect, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

interface FluidPaintCanvasProps {
  className?: string;
  colors?: string[];
  maxParticles?: number;
  fadeSpeed?: number;
  particleSize?: number;
  trailLength?: number;
  glowIntensity?: number;
}

const FluidPaintCanvas: React.FC<FluidPaintCanvasProps> = ({
  className = '',
  colors = ['#ff0000', '#ff3333', '#cc0000', '#ff6666', '#990000'],
  maxParticles = 400,
  fadeSpeed = 0.012,
  particleSize = 50,
  trailLength = 15,
  glowIntensity = 1.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const timeRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 0, b: 0 };
  }, []);

  const createParticle = useCallback((x: number, y: number, vx: number, vy: number, forceSize?: number) => {
    const speed = Math.sqrt(vx * vx + vy * vy);
    const baseSize = forceSize || Math.min(particleSize, Math.max(15, particleSize * (speed / 30)));
    const sizeVariation = baseSize * (0.5 + Math.random() * 0.8);
    
    const particle: Particle = {
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: vx * (0.15 + Math.random() * 0.2) + (Math.random() - 0.5) * 2,
      vy: vy * (0.15 + Math.random() * 0.2) + (Math.random() - 0.5) * 2,
      color: getRandomColor(),
      size: sizeVariation,
      life: 1,
      maxLife: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
    };
    
    particlesRef.current.push(particle);
    
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current = particlesRef.current.slice(-maxParticles);
    }
  }, [getRandomColor, maxParticles, particleSize]);

  const createBurst = useCallback((x: number, y: number, count: number = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 5 + Math.random() * 10;
      const size = particleSize * (0.5 + Math.random() * 0.6);
      createParticle(
        x + Math.cos(angle) * 8,
        y + Math.sin(angle) * 8,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        size
      );
    }
  }, [createParticle, particleSize]);

  // Intersection Observer for visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Separate animation effect that respects visibility
  useEffect(() => {
    if (!isVisible || !ctxRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = () => {
      if (!ctxRef.current || !isVisible) return;
      const ctx = ctxRef.current;
      const rect = canvas.getBoundingClientRect();
      timeRef.current += 0.016;
      
      // Fade with color persistence
      ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Skip rendering if no particles
      if (particlesRef.current.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.globalCompositeOperation = 'lighter';
      
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= fadeSpeed;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        particle.vy += 0.015;
        particle.rotation += particle.rotationSpeed;
        
        const currentSize = particle.size * particle.life;
        
        if (particle.life <= 0 || currentSize < 1) return false;
        
        const rgb = hexToRgb(particle.color);
        const alpha = particle.life * 0.85;
        
        // Simplified glow - fewer layers for performance
        const layers = [
          { scale: 2.5, alpha: alpha * 0.2 * glowIntensity },
          { scale: 1.5, alpha: alpha * 0.5 },
          { scale: 0.8, alpha: alpha * 0.9 },
        ];
        
        layers.forEach(layer => {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, currentSize * layer.scale
          );
          gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layer.alpha})`);
          gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layer.alpha * 0.3})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, currentSize * layer.scale, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        });
        
        return true;
      });
      
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, fadeSpeed, hexToRgb, glowIntensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true;
      const pos = 'touches' in e ? getPos(e.touches[0]) : getPos(e);
      lastPosRef.current = pos;
      velocityRef.current = { x: 0, y: 0 };
      
      createBurst(pos.x, pos.y, 10);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pos = 'touches' in e ? getPos(e.touches[0]) : getPos(e);
      const dx = pos.x - lastPosRef.current.x;
      const dy = pos.y - lastPosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      velocityRef.current = {
        x: velocityRef.current.x * 0.7 + dx * 0.3,
        y: velocityRef.current.y * 0.7 + dy * 0.3,
      };
      
      if (isDrawingRef.current && speed > 2) {
        const steps = Math.min(Math.ceil(speed / 5), trailLength);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const x = lastPosRef.current.x + dx * t;
          const y = lastPosRef.current.y + dy * t;
          
          // Fewer particles per step for performance
          const particleCount = Math.min(Math.ceil(speed / 20) + 1, 3);
          for (let j = 0; j < particleCount; j++) {
            createParticle(
              x + (Math.random() - 0.5) * speed * 0.4,
              y + (Math.random() - 0.5) * speed * 0.4,
              velocityRef.current.x * (0.4 + Math.random() * 0.4),
              velocityRef.current.y * (0.4 + Math.random() * 0.4)
            );
          }
        }
      }
      
      lastPosRef.current = pos;
    };

    const handleEnd = () => {
      if (isDrawingRef.current) {
        const speed = Math.sqrt(
          velocityRef.current.x ** 2 + velocityRef.current.y ** 2
        );
        if (speed > 5) {
          createBurst(lastPosRef.current.x, lastPosRef.current.y, Math.min(12, Math.ceil(speed * 0.8)));
        }
      }
      isDrawingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: true });
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [createParticle, createBurst, trailLength]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          touchAction: 'none',
          background: 'transparent',
        }}
      />
    </div>
  );
};

export default FluidPaintCanvas;

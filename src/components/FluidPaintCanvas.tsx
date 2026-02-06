import React, { useRef, useEffect, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  r: number;
  g: number;
  b: number;
  size: number;
  life: number;
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

// Pre-compute hex to RGB at color array level for performance
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 0, b: 0 };
};

const FluidPaintCanvas: React.FC<FluidPaintCanvasProps> = ({
  className = '',
  colors = ['#ff0000', '#ff3333', '#cc0000', '#ff6666', '#990000'],
  maxParticles = 600,
  fadeSpeed = 0.01,
  particleSize = 55,
  trailLength = 18,
  glowIntensity = 1.6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFrameTimeRef = useRef(0);
  const rgbColorsRef = useRef<Array<{r: number, g: number, b: number}>>([]);

  // Pre-compute RGB values for all colors
  useEffect(() => {
    rgbColorsRef.current = colors.map(hexToRgb);
  }, [colors]);

  const getRandomColorRgb = useCallback(() => {
    const rgbColors = rgbColorsRef.current;
    return rgbColors[Math.floor(Math.random() * rgbColors.length)] || { r: 255, g: 0, b: 0 };
  }, []);

  const createParticle = useCallback((x: number, y: number, vx: number, vy: number, forceSize?: number) => {
    const speed = Math.sqrt(vx * vx + vy * vy);
    const baseSize = forceSize || Math.min(particleSize, Math.max(20, particleSize * (speed / 30)));
    const sizeVariation = baseSize * (0.5 + Math.random() * 1);
    const rgb = getRandomColorRgb();
    
    const particle: Particle = {
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      vx: vx * (0.2 + Math.random() * 0.3) + (Math.random() - 0.5) * 3,
      vy: vy * (0.2 + Math.random() * 0.3) + (Math.random() - 0.5) * 3,
      color: '',
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      size: sizeVariation,
      life: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
    
    particlesRef.current.push(particle);
    
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(0, particlesRef.current.length - maxParticles);
    }
  }, [getRandomColorRgb, maxParticles, particleSize]);

  const createBurst = useCallback((x: number, y: number, count: number = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 8 + Math.random() * 15;
      const size = particleSize * (0.6 + Math.random() * 0.8);
      createParticle(
        x + Math.cos(angle) * 10,
        y + Math.sin(angle) * 10,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        size
      );
    }
  }, [createParticle, particleSize]);

  // Intersection Observer for visibility - pause when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '100px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    
    let resizeTimeout: number;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 100);
    };
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Optimized animation loop
  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const animate = (currentTime: number) => {
      // Throttle to ~60fps
      const deltaTime = currentTime - lastFrameTimeRef.current;
      if (deltaTime < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      if (particles.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.globalCompositeOperation = 'lighter';
      
      // Batch process particles
      let writeIndex = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life -= fadeSpeed;
        
        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vy += 0.02;
        p.rotation += p.rotationSpeed;
        
        const currentSize = p.size * (0.9 + Math.sin(currentTime * 0.003 + p.rotation) * 0.1) * p.life;
        
        if (p.life <= 0 || currentSize < 1) continue;
        
        // Keep particle
        particles[writeIndex++] = p;
        
        const alpha = p.life * 0.85;
        const { r, g, b } = p;
        
        // Outer glow
        const gradient1 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 3);
        gradient1.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.2 * glowIntensity})`);
        gradient1.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.1 * glowIntensity})`);
        gradient1.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient1;
        ctx.fill();
        
        // Mid glow
        const gradient2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 1.8);
        gradient2.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
        gradient2.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.25})`);
        gradient2.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = gradient2;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
        ctx.fill();
        
        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx.fill();
      }
      
      // Trim dead particles in place
      particles.length = writeIndex;
      
      ctx.globalCompositeOperation = 'source-over';
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, fadeSpeed, glowIntensity]);

  // Event handlers
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
      createBurst(pos.x, pos.y, 15);
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
      
      if (isDrawingRef.current && speed > 1) {
        const steps = Math.min(Math.ceil(speed / 3), trailLength);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const x = lastPosRef.current.x + dx * t;
          const y = lastPosRef.current.y + dy * t;
          
          const particleCount = Math.ceil(speed / 15) + 1;
          for (let j = 0; j < particleCount; j++) {
            createParticle(
              x + (Math.random() - 0.5) * speed * 0.5,
              y + (Math.random() - 0.5) * speed * 0.5,
              velocityRef.current.x * (0.5 + Math.random() * 0.5),
              velocityRef.current.y * (0.5 + Math.random() * 0.5)
            );
          }
        }
      }
      
      lastPosRef.current = pos;
    };

    const handleEnd = () => {
      if (isDrawingRef.current) {
        const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
        if (speed > 5) {
          createBurst(lastPosRef.current.x, lastPosRef.current.y, Math.min(20, Math.ceil(speed)));
        }
      }
      isDrawingRef.current = false;
    };

    // Use passive listeners for better scroll performance
    canvas.addEventListener('mousedown', handleStart, { passive: true });
    canvas.addEventListener('mousemove', handleMove, { passive: true });
    canvas.addEventListener('mouseup', handleEnd, { passive: true });
    canvas.addEventListener('mouseleave', handleEnd, { passive: true });
    canvas.addEventListener('touchstart', handleStart, { passive: true });
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    canvas.addEventListener('touchend', handleEnd, { passive: true });

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
    <div 
      ref={containerRef} 
      className={`absolute inset-0 ${className}`}
      style={{ contain: 'strict' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          touchAction: 'none',
          background: 'transparent',
          willChange: 'contents',
        }}
      />
    </div>
  );
};

export default FluidPaintCanvas;

import React, { useRef, useEffect, useCallback } from 'react';

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
  maxParticles = 800,
  fadeSpeed = 0.008,
  particleSize = 60,
  trailLength = 20,
  glowIntensity = 1.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const timeRef = useRef(0);

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
    const baseSize = forceSize || Math.min(particleSize, Math.max(20, particleSize * (speed / 30)));
    const sizeVariation = baseSize * (0.5 + Math.random() * 1);
    
    const particle: Particle = {
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      vx: vx * (0.2 + Math.random() * 0.3) + (Math.random() - 0.5) * 3,
      vy: vy * (0.2 + Math.random() * 0.3) + (Math.random() - 0.5) * 3,
      color: getRandomColor(),
      size: sizeVariation,
      life: 1,
      maxLife: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
    
    particlesRef.current.push(particle);
    
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current = particlesRef.current.slice(-maxParticles);
    }
  }, [getRandomColor, maxParticles, particleSize]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctxRef.current) return;
      const ctx = ctxRef.current;
      const rect = canvas.getBoundingClientRect();
      timeRef.current += 0.016;
      
      // Subtle fade with color persistence
      ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Update and draw particles with metaball-like blending
      ctx.globalCompositeOperation = 'lighter';
      
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= fadeSpeed;
        
        // Physics with organic movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.vy += 0.02; // Subtle gravity
        particle.rotation += particle.rotationSpeed;
        
        // Organic size pulsing
        const pulse = Math.sin(timeRef.current * 3 + particle.rotation) * 0.1;
        const currentSize = particle.size * (0.9 + pulse) * particle.life;
        
        if (particle.life <= 0 || currentSize < 1) return false;
        
        const rgb = hexToRgb(particle.color);
        const alpha = particle.life * 0.9;
        
        // Multi-layer glow effect
        const layers = [
          { scale: 3.5, alpha: alpha * 0.15 * glowIntensity },
          { scale: 2.5, alpha: alpha * 0.25 * glowIntensity },
          { scale: 1.8, alpha: alpha * 0.4 },
          { scale: 1.2, alpha: alpha * 0.6 },
          { scale: 0.8, alpha: alpha * 0.9 },
        ];
        
        layers.forEach(layer => {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, currentSize * layer.scale
          );
          gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layer.alpha})`);
          gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layer.alpha * 0.5})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, currentSize * layer.scale, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        });
        
        // Bright core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.fill();
        
        return true;
      });
      
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fadeSpeed, hexToRgb, glowIntensity]);

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
      
      // Initial burst on click
      createBurst(pos.x, pos.y, 15);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pos = 'touches' in e ? getPos(e.touches[0]) : getPos(e);
      const dx = pos.x - lastPosRef.current.x;
      const dy = pos.y - lastPosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Smooth velocity
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
          
          // Create multiple particles per step for thick trails
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
        // Final burst on release
        const speed = Math.sqrt(
          velocityRef.current.x ** 2 + velocityRef.current.y ** 2
        );
        if (speed > 5) {
          createBurst(lastPosRef.current.x, lastPosRef.current.y, Math.min(20, Math.ceil(speed)));
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
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ 
        touchAction: 'none',
        background: 'transparent',
      }}
    />
  );
};

export default FluidPaintCanvas;

import React, { useRef, useEffect, useCallback } from 'react';

interface Splat {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  radius: number;
  life: number;
  maxLife: number;
}

interface FluidPaintCanvasProps {
  className?: string;
  colors?: string[];
  maxSplats?: number;
  fadeSpeed?: number;
  splatRadius?: number;
  trailLength?: number;
}

const FluidPaintCanvas: React.FC<FluidPaintCanvasProps> = ({
  className = '',
  colors = ['#ff0000', '#ff3333', '#cc0000', '#ff6666', '#990000'],
  maxSplats = 500,
  fadeSpeed = 0.015,
  splatRadius = 40,
  trailLength = 15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const splatsRef = useRef<Splat[]>([]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  const createSplat = useCallback((x: number, y: number, dx: number, dy: number) => {
    const speed = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(splatRadius, Math.max(15, splatRadius * (speed / 50)));
    
    const splat: Splat = {
      x,
      y,
      dx: dx * 0.3,
      dy: dy * 0.3,
      color: getRandomColor(),
      radius,
      life: 1,
      maxLife: 1,
    };
    
    splatsRef.current.push(splat);
    
    // Limit splats
    if (splatsRef.current.length > maxSplats) {
      splatsRef.current = splatsRef.current.slice(-maxSplats);
    }
  }, [getRandomColor, maxSplats, splatRadius]);

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

    // Animation loop
    const animate = () => {
      if (!ctxRef.current) return;
      const ctx = ctxRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Update and draw splats
      splatsRef.current = splatsRef.current.filter(splat => {
        splat.life -= fadeSpeed;
        splat.x += splat.dx;
        splat.y += splat.dy;
        splat.dx *= 0.98;
        splat.dy *= 0.98;
        splat.radius *= 0.995;
        
        if (splat.life <= 0 || splat.radius < 1) return false;
        
        // Draw splat with glow
        const alpha = splat.life * 0.8;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          splat.x, splat.y, 0,
          splat.x, splat.y, splat.radius * 2
        );
        gradient.addColorStop(0, `${splat.color}${Math.floor(alpha * 180).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.4, `${splat.color}${Math.floor(alpha * 100).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(splat.x, splat.y, splat.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(splat.x, splat.y, splat.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `${splat.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fadeSpeed]);

  // Mouse/Touch handlers
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
      
      // Initial splat burst
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        const speed = 5 + Math.random() * 10;
        createSplat(
          pos.x + Math.random() * 10 - 5,
          pos.y + Math.random() * 10 - 5,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      
      const pos = 'touches' in e ? getPos(e.touches[0]) : getPos(e);
      const dx = pos.x - lastPosRef.current.x;
      const dy = pos.y - lastPosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      if (speed > 2) {
        // Create multiple splats along the path
        const steps = Math.min(Math.ceil(speed / 5), trailLength);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const x = lastPosRef.current.x + dx * t + (Math.random() - 0.5) * 20;
          const y = lastPosRef.current.y + dy * t + (Math.random() - 0.5) * 20;
          
          createSplat(x, y, dx * 0.5, dy * 0.5);
        }
      }
      
      lastPosRef.current = pos;
    };

    const handleEnd = () => {
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
  }, [createSplat, trailLength]);

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

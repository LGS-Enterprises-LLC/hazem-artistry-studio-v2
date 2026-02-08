import React, { useRef, useEffect, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  size: number;
  life: number;
  maxLife: number;
  angle: number;
  stretch: number;
  opacity: number;
}

interface FluidPaintCanvasProps {
  className?: string;
  colors?: string[];
  maxParticles?: number;
  fadeSpeed?: number;
  particleSize?: number;
  trailLength?: number;
  glowIntensity?: number;
  ambientSplats?: boolean;
  ambientInterval?: number;
}

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
  ambientSplats = true,
  ambientInterval = 3000,
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
  const rgbColorsRef = useRef<Array<{ r: number, g: number, b: number }>>([]);
  const ambientTimerRef = useRef<number>();
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  // Pre-compute RGB values
  useEffect(() => {
    rgbColorsRef.current = colors.map(hexToRgb);
  }, [colors]);

  const getRandomColorRgb = useCallback(() => {
    const rgbColors = rgbColorsRef.current;
    return rgbColors[Math.floor(Math.random() * rgbColors.length)] || { r: 255, g: 0, b: 0 };
  }, []);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const getBlendedColor = useCallback(() => {
    const rgbColors = rgbColorsRef.current;
    if (rgbColors.length < 2) return rgbColors[0] || { r: 255, g: 0, b: 0 };

    const idx1 = Math.floor(Math.random() * rgbColors.length);
    const idx2 = Math.floor(Math.random() * rgbColors.length);
    const t = Math.random();

    return {
      r: Math.round(lerp(rgbColors[idx1].r, rgbColors[idx2].r, t)),
      g: Math.round(lerp(rgbColors[idx1].g, rgbColors[idx2].g, t)),
      b: Math.round(lerp(rgbColors[idx1].b, rgbColors[idx2].b, t)),
    };
  }, []);

  const createParticle = useCallback((x: number, y: number, vx: number, vy: number, forceSize?: number): void => {
    const speed = Math.sqrt(vx * vx + vy * vy);
    const baseSize = forceSize || Math.min(particleSize, Math.max(15, particleSize * (speed / 25)));
    const sizeVariation = baseSize * (0.6 + Math.random() * 0.8);
    const rgb = Math.random() > 0.3 ? getBlendedColor() : getRandomColorRgb();

    // Calculate angle from velocity for brush stroke direction
    const angle = Math.atan2(vy, vx);
    // More stretch = more brush-like; based on speed
    const stretch = Math.min(3.5, 1.2 + speed * 0.08);

    const particle: Particle = {
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: vx * (0.15 + Math.random() * 0.25) + (Math.random() - 0.5) * 2,
      vy: vy * (0.15 + Math.random() * 0.25) + (Math.random() - 0.5) * 2,
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      size: sizeVariation,
      life: 1,
      maxLife: 1,
      angle: angle + (Math.random() - 0.5) * 0.4,
      stretch,
      opacity: 0.4 + Math.random() * 0.4,
    };

    particlesRef.current.push(particle);

    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(0, particlesRef.current.length - maxParticles);
    }
  }, [getBlendedColor, getRandomColorRgb, maxParticles, particleSize]);

  const createBrushSplat = useCallback((x: number, y: number, count: number = 18, spread: number = 40) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const dist = Math.random() * spread;
      const speed = 2 + Math.random() * 6;
      const size = particleSize * (0.4 + Math.random() * 1.0);
      createParticle(
        x + Math.cos(angle) * dist,
        y + Math.sin(angle) * dist,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        size
      );
    }
    // Add some smaller satellite droplets
    for (let i = 0; i < count * 0.6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = spread * 0.5 + Math.random() * spread;
      const speed = 1 + Math.random() * 3;
      const size = particleSize * (0.15 + Math.random() * 0.35);
      createParticle(
        x + Math.cos(angle) * dist,
        y + Math.sin(angle) * dist,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        size
      );
    }
  }, [createParticle, particleSize]);

  // Ambient auto-splats
  useEffect(() => {
    if (!ambientSplats || !isVisible) {
      if (ambientTimerRef.current) {
        clearInterval(ambientTimerRef.current);
        ambientTimerRef.current = undefined;
      }
      return;
    }

    const doAmbientSplat = () => {
      const { width, height } = canvasSizeRef.current;
      if (width === 0 || height === 0) return;

      // Random position with some padding from edges
      const padding = 80;
      const x = padding + Math.random() * (width - padding * 2);
      const y = padding + Math.random() * (height - padding * 2);

      // Smaller, gentler splats for ambient effect
      const count = 6 + Math.floor(Math.random() * 10);
      const spread = 20 + Math.random() * 40;

      createBrushSplat(x, y, count, spread);
    };

    // Initial delay before first splat
    const initialDelay = setTimeout(() => {
      doAmbientSplat();
      ambientTimerRef.current = window.setInterval(doAmbientSplat, ambientInterval + Math.random() * 2000);
    }, 1000 + Math.random() * 2000);

    return () => {
      clearTimeout(initialDelay);
      if (ambientTimerRef.current) {
        clearInterval(ambientTimerRef.current);
      }
    };
  }, [ambientSplats, ambientInterval, isVisible, createBrushSplat]);

  // Intersection Observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Canvas setup
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
      canvasSizeRef.current = { width: rect.width, height: rect.height };
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

  // Animation loop with brush-stroke rendering
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
      const deltaTime = currentTime - lastFrameTimeRef.current;
      if (deltaTime < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      const { width, height } = canvasSizeRef.current;

      // Soft fade for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      if (particles.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.globalCompositeOperation = 'lighter';

      let writeIndex = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life -= fadeSpeed;

        // Soft physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy += 0.01; // minimal gravity

        // Gradually reduce stretch as particle slows
        p.stretch = Math.max(1.0, p.stretch * 0.995);
        // Update angle to follow velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.5) {
          p.angle = Math.atan2(p.vy, p.vx);
        }

        const lifeFactor = p.life / p.maxLife;
        // Smooth ease-out for size
        const sizeCurve = Math.sin(lifeFactor * Math.PI);
        const currentSize = p.size * sizeCurve;

        if (p.life <= 0 || currentSize < 0.5) continue;

        particles[writeIndex++] = p;

        const alpha = lifeFactor * p.opacity;
        const { r, g, b } = p;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Outer soft glow - wide, very transparent
        const glowSize = currentSize * 2.5;
        const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        gradient1.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15 * glowIntensity})`);
        gradient1.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.06 * glowIntensity})`);
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.ellipse(0, 0, glowSize * p.stretch, glowSize, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient1;
        ctx.fill();

        // Main brush body - stretched ellipse
        const bodyW = currentSize * p.stretch;
        const bodyH = currentSize * 0.7;
        const gradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(bodyW, bodyH));
        gradient2.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`);
        gradient2.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
        gradient2.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.ellipse(0, 0, bodyW, bodyH, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient2;
        ctx.fill();

        // Hot core - small bright center
        const coreSize = currentSize * 0.25;
        ctx.beginPath();
        ctx.ellipse(0, 0, coreSize * p.stretch * 0.6, coreSize, 0, 0, Math.PI * 2);
        const coreAlpha = alpha * 0.5;
        const coreR = Math.min(255, r + 60);
        const coreG = Math.min(255, g + 60);
        const coreB = Math.min(255, b + 60);
        ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${coreAlpha})`;
        ctx.fill();

        ctx.restore();
      }

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
      createBrushSplat(pos.x, pos.y, 20, 30);
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
        const steps = Math.min(Math.ceil(speed / 4), trailLength);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const x = lastPosRef.current.x + dx * t;
          const y = lastPosRef.current.y + dy * t;

          // More particles at higher speeds for denser strokes
          const particleCount = Math.ceil(speed / 12) + 2;
          for (let j = 0; j < particleCount; j++) {
            // Perpendicular spread for brush width
            const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
            const spreadDist = (Math.random() - 0.5) * speed * 0.3;
            createParticle(
              x + Math.cos(perpAngle) * spreadDist,
              y + Math.sin(perpAngle) * spreadDist,
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
        const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
        if (speed > 4) {
          createBrushSplat(lastPosRef.current.x, lastPosRef.current.y, Math.min(16, Math.ceil(speed * 0.8)), speed * 2);
        }
      }
      isDrawingRef.current = false;
    };

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
  }, [createParticle, createBrushSplat, trailLength]);

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

import React, { useRef, useEffect, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  angle: number;
  stretch: number;
  opacity: number;
  spriteIndex: number;
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

  // Cache for pre-rendered sprites
  const spritesRef = useRef<HTMLCanvasElement[]>([]);
  const SPRITE_SIZE = particleSize * 5; // Enough space for glow (2.5x radius)

  // Pre-compute RGB values
  useEffect(() => {
    rgbColorsRef.current = colors.map(hexToRgb);
  }, [colors]);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Generate Sprites (Base + Mixed)
  useEffect(() => {
    const sprites: HTMLCanvasElement[] = [];
    const baseRgbs = colors.map(hexToRgb);
    const mixCount = 40; // Generate 40 random blends for variety

    const allRgbs = [...baseRgbs];

    for (let i = 0; i < mixCount; i++) {
      if (baseRgbs.length < 2) break;
      const idx1 = Math.floor(Math.random() * baseRgbs.length);
      const idx2 = Math.floor(Math.random() * baseRgbs.length);
      const t = Math.random();
      allRgbs.push({
        r: Math.round(lerp(baseRgbs[idx1].r, baseRgbs[idx2].r, t)),
        g: Math.round(lerp(baseRgbs[idx1].g, baseRgbs[idx2].g, t)),
        b: Math.round(lerp(baseRgbs[idx1].b, baseRgbs[idx2].b, t)),
      });
    }

    allRgbs.forEach(({ r, g, b }) => {
      const sprite = document.createElement('canvas');
      sprite.width = SPRITE_SIZE;
      sprite.height = SPRITE_SIZE;
      const ctx = sprite.getContext('2d');
      if (!ctx) return;

      const center = SPRITE_SIZE / 2;
      // Use a fixed reference size for drawing the sprite, we scale it later
      const refSize = SPRITE_SIZE / 5; // Equivalent to 'currentSize' in original logic if stretch=1

      // 1. Outer Glow
      const glowSize = refSize * 2.5;
      const gradient1 = ctx.createRadialGradient(center, center, 0, center, center, glowSize);
      // Bake in relative alphas. Global alpha will scale this.
      gradient1.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.15 * glowIntensity})`);
      gradient1.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.06 * glowIntensity})`);
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(center, center, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient1;
      ctx.fill();

      // 2. Body (Standard aspect ratio, we stretch via transform later)
      const bodyW = refSize;
      const bodyH = refSize * 0.7;
      const gradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, bodyW); // Fix: relative to transform, wait no, gradient is absolute coord system usually unless transformed
      // Actually for sprite generation, simpler to just use radial gradient centered at center
      const gradient2Fixed = ctx.createRadialGradient(center, center, 0, center, center, Math.max(bodyW, bodyH));
      gradient2Fixed.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.7)`);
      gradient2Fixed.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.4)`);
      gradient2Fixed.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.15)`);
      gradient2Fixed.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.ellipse(center, center, bodyW, bodyH, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradient2Fixed;
      ctx.fill();

      // 3. Core
      const coreSize = refSize * 0.25;
      const coreW = coreSize * 0.6;
      const coreH = coreSize;
      const coreR = Math.min(255, r + 60);
      const coreG = Math.min(255, g + 60);
      const coreB = Math.min(255, b + 60);

      ctx.beginPath();
      ctx.ellipse(center, center, coreW, coreH, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, 0.5)`;
      ctx.fill();

      sprites.push(sprite);
    });

    spritesRef.current = sprites;
  }, [colors, glowIntensity, SPRITE_SIZE]);


  const createParticle = useCallback((x: number, y: number, vx: number, vy: number, forceSize?: number): void => {
    const speed = Math.sqrt(vx * vx + vy * vy);
    const baseSize = forceSize || Math.min(particleSize, Math.max(15, particleSize * (speed / 25)));
    const sizeVariation = baseSize * (0.6 + Math.random() * 0.8);

    // Select a random pre-rendered sprite
    const spriteIndex = Math.floor(Math.random() * spritesRef.current.length);

    const angle = Math.atan2(vy, vx);
    const stretch = Math.min(3.5, 1.2 + speed * 0.08);

    const particle: Particle = {
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: vx * (0.15 + Math.random() * 0.25) + (Math.random() - 0.5) * 2,
      vy: vy * (0.15 + Math.random() * 0.25) + (Math.random() - 0.5) * 2,
      size: sizeVariation,
      life: 1,
      maxLife: 1,
      angle: angle + (Math.random() - 0.5) * 0.4,
      stretch,
      opacity: 0.4 + Math.random() * 0.4,
      spriteIndex,
    };

    particlesRef.current.push(particle);

    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(0, particlesRef.current.length - maxParticles);
    }
  }, [maxParticles, particleSize]);

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

      const padding = 80;
      const x = padding + Math.random() * (width - padding * 2);
      const y = padding + Math.random() * (height - padding * 2);

      const count = 6 + Math.floor(Math.random() * 10);
      const spread = 20 + Math.random() * 40;

      createBrushSplat(x, y, count, spread);
    };

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
      // Use devicePixelRatio but capped at 2 for performance
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

  // Animation loop with Sprite Rendering
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

      // Clear/Fade
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

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy += 0.01;

        p.stretch = Math.max(1.0, p.stretch * 0.995);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.5) {
          p.angle = Math.atan2(p.vy, p.vx);
        }

        const lifeFactor = p.life / p.maxLife;
        const sizeCurve = Math.sin(lifeFactor * Math.PI);
        const currentSize = p.size * sizeCurve;

        if (p.life <= 0 || currentSize < 0.5) continue;

        particles[writeIndex++] = p;

        const sprite = spritesRef.current[p.spriteIndex];
        if (!sprite) continue;

        const alpha = lifeFactor * p.opacity;
        ctx.globalAlpha = alpha;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(p.stretch, 1);

        const drawSize = currentSize * 5;
        ctx.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);

        ctx.restore();
      }

      particles.length = writeIndex;
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, fadeSpeed]);

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

          const particleCount = Math.ceil(speed / 12) + 2;
          for (let j = 0; j < particleCount; j++) {
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

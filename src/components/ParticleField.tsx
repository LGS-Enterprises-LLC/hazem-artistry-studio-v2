import React, { useMemo } from 'react';

interface ParticleFieldProps {
  count?: number;
  color?: string;
}

// CSS-only particle field — same floating ambient effect, zero WebGL/Three.js
const ParticleField: React.FC<ParticleFieldProps> = ({ color = '#ff4444' }) => {
  const particles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 18 + 8,
      delay: -(Math.random() * 18),
      tx: (Math.random() - 0.5) * 100,
      ty: (Math.random() - 0.5) * 100,
      opacity: Math.random() * 0.4 + 0.1,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.opacity,
            animation: `css-particle-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
            '--ptx': `${p.tx}px`,
            '--pty': `${p.ty}px`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default React.memo(ParticleField);

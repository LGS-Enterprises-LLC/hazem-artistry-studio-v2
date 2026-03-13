import React from 'react';

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

// Lightweight CSS replacement — same visual warmth, zero canvas overhead
const FluidPaintCanvas: React.FC<FluidPaintCanvasProps> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ contain: 'strict' }}>
    <div className="fluid-orb fluid-orb-1" />
    <div className="fluid-orb fluid-orb-2" />
    <div className="fluid-orb fluid-orb-3" />
    <div className="fluid-orb fluid-orb-4" />
    <div className="fluid-orb fluid-orb-5" />
  </div>
);

export default React.memo(FluidPaintCanvas);

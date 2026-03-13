import React from 'react';
import ParticleField from './ParticleField';

// CSS-only replacement for Three.js/WebGL HeroBackground
// Same ambient particle feel + floating orbs, zero GPU budget
const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* CSS floating particles */}
      <ParticleField count={35} color="#ff3333" />

      {/* CSS floating orbs (replaces Three.js spheres) */}
      <div className="hero-orb hero-orb-red" />
      <div className="hero-orb hero-orb-white" />

      {/* Gradient overlays — unchanged */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />
    </div>
  );
};

export default HeroBackground;

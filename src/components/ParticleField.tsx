import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  color?: string;
}

const Particles: React.FC<ParticlesProps> = ({ count = 1000, color = '#ff0000' }) => {
  const mesh = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = Math.random() * 5 + 2;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, velocities, sizes };
  }, [count]);

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return;

    mousePosition.current = { x: mouse.x * 2, y: mouse.y * 2 };

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Add subtle movement
      positions[i3] += Math.sin(time * 0.5 + i) * 0.002;
      positions[i3 + 1] += Math.cos(time * 0.3 + i) * 0.002;
      positions[i3 + 2] += Math.sin(time * 0.4 + i) * 0.002;

      // Mouse repulsion
      const dx = positions[i3] - mousePosition.current.x;
      const dy = positions[i3 + 1] - mousePosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 2) {
        const force = (2 - distance) * 0.01;
        positions[i3] += dx * force;
        positions[i3 + 1] += dy * force;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = time * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface ParticleFieldProps {
  className?: string;
  count?: number;
  color?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ 
  className = '', 
  count = 800,
  color = '#ff0000',
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <Particles count={count} color={color} />
      </Canvas>
    </div>
  );
};

export default ParticleField;

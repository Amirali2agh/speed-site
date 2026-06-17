import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// 1. Math generators to define 3D coordinates for different shapes
const getSpherePositions = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.6;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
};

const getWavePositions = (count) => {
  const positions = new Float32Array(count * 3);
  const size = Math.sqrt(count);
  for (let i = 0; i < count; i++) {
    const x = (i % size) / size - 0.5;
    const z = Math.floor(i / size) / size - 0.5;
    positions[i * 3] = x * 5;
    positions[i * 3 + 1] = Math.sin(x * 8) * 0.4; // Wave oscillation depth
    positions[i * 3 + 2] = z * 5;
  }
  return positions;
};

const getTorusPositions = (count) => {
  const positions = new Float32Array(count * 3);
  const rTorus = 1.3;
  const rTube = 0.4;
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 * Math.PI;
    const v = Math.random() * 2 * Math.PI;
    positions[i * 3] = (rTorus + rTube * Math.cos(v)) * Math.cos(u);
    positions[i * 3 + 1] = (rTorus + rTube * Math.cos(v)) * Math.sin(u);
    positions[i * 3 + 2] = rTube * Math.sin(v);
  }
  return positions;
};

// 2. Immersive Particle System Component
export default function ImmersiveParticles({ count = 3600 }) {
  const pointsRef = useRef(null);
  const scroll = useScroll(); // Hook to access smooth scroll metrics

  // Memoize positions to avoid recalculating heavy coordinate math on every render
  const shapes = useMemo(() => ({
    sphere: getSpherePositions(count),
    wave: getWavePositions(count),
    torus: getTorusPositions(count),
    current: new Float32Array(count * 3) // Temp storage to mutate in real-time
  }), [count]);

  // useFrame runs at 60fps to handle smooth interpolations and interactive shifts
  useFrame((state) => {
    if (!pointsRef.current) return;

    const points = pointsRef.current;
    const positionAttr = points.geometry.attributes.position;
    const scrollOffset = scroll.offset; // Normalized scroll progress (0 to 1)

    // Morphing interpolation loop
    for (let i = 0; i < count * 3; i++) {
      let targetValue = 0;

      if (scrollOffset < 0.5) {
        // Phase 1: Interpolate from Sphere to Wave
        const t = scrollOffset * 2.0; // Map [0, 0.5] range to [0, 1]
        targetValue = THREE.MathUtils.lerp(shapes.sphere[i], shapes.wave[i], t);
      } else {
        // Phase 2: Interpolate from Wave to Torus
        const t = (scrollOffset - 0.5) * 2.0; // Map [0.5, 1.0] range to [0, 1]
        targetValue = THREE.MathUtils.lerp(shapes.wave[i], shapes.torus[i], t);
      }

      // Apply elastic lerp for high-quality, spring-like physical transition
      positionAttr.array[i] = THREE.MathUtils.lerp(positionAttr.array[i], targetValue, 0.08);
    }

    // Mark the buffer geometry attribute as modified so WebGL knows to re-render it
    positionAttr.needsUpdate = true;

    // Fluid camera-mouse interaction: rotate the coordinate space slightly on hover
    points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, state.pointer.y * 0.25, 0.05);
    points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, state.pointer.x * 0.25 + state.clock.getElapsedTime() * 0.03, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* We initially spawn particles using the Sphere positions array */}
        <bufferAttribute
          attach="attributes-position"
          args={[shapes.sphere, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c084fc" // High-tech neon purple color
        size={0.025} // Particle diameter
        sizeAttenuation={true} // Makes particles smaller when far from the camera
        transparent={true}
        opacity={0.8}
        depthWrite={false} // Prevents particles from clipping/hiding behind each other
        blending={THREE.AdditiveBlending} // Blends overlapping particles for glowing effect
      />
    </points>
  );
}
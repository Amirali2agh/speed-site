import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// 1. Math generators for main morphing shapes (Optimized counts)
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
    positions[i * 3 + 1] = Math.sin(x * 8) * 0.4;
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

// 2. High-Performance Particle Engine
export default function ImmersiveParticles({ count = 1600, setPage, setScrollEl }) {
  const pointsRef = useRef(null);
  const dustRef = useRef(null);
  
  const scroll = useScroll();
  const { size, viewport } = useThree();
  const isMobile = size.width < 768;

  const lastActivePage = useRef('home');

  const shapes = useMemo(() => ({
    sphere: getSpherePositions(count),
    wave: getWavePositions(count),
    torus: getTorusPositions(count),
    current: new Float32Array(count * 3)
  }), [count]);

  // Reduced background ambient dust particles to 80 for pure CPU optimization
  const dustPositions = useMemo(() => {
    const positions = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      positions[i * 3] = (THREE.MathUtils.randFloatSpread(10));
      positions[i * 3 + 1] = (THREE.MathUtils.randFloatSpread(10));
      positions[i * 3 + 2] = (THREE.MathUtils.randFloatSpread(8));
    }
    return positions;
  }, []);

  const responsiveScale = isMobile ? 0.75 : 1.1;
  // Slightly larger particle size to maintain visual density with lower counts
  const particleSize = isMobile ? 0.05 : 0.035;

  useEffect(() => {
    if (setScrollEl && scroll.el) {
      setScrollEl(scroll.el);
    }
  }, [scroll, setScrollEl]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const points = pointsRef.current;
    const positionAttr = points.geometry.attributes.position;
    const scrollOffset = scroll.offset;
    const elapsedTime = state.clock.getElapsedTime();

    // Subtle breathing light
    points.material.opacity = 0.65 + Math.sin(elapsedTime * 1.5) * 0.15;

    const mouse3D = new THREE.Vector3(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0
    );

    const repulsionRadius = isMobile ? 0.5 : 0.95;
    const repulsionStrength = isMobile ? 0.15 : 0.45;

    // Squared Radius pre-calculated to bypass Math.sqrt inside loop
    const radiusSq = repulsionRadius * repulsionRadius;

    // C. Highly Optimized Physics Loop
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      let targetX = 0, targetY = 0, targetZ = 0;
      if (scrollOffset < 0.5) {
        const t = scrollOffset * 2.0;
        targetX = THREE.MathUtils.lerp(shapes.sphere[i3], shapes.wave[i3], t);
        targetY = THREE.MathUtils.lerp(shapes.sphere[i3 + 1], shapes.wave[i3 + 1], t);
        targetZ = THREE.MathUtils.lerp(shapes.sphere[i3 + 2], shapes.wave[i3 + 2], t);
      } else {
        const t = (scrollOffset - 0.5) * 2.0;
        targetX = THREE.MathUtils.lerp(shapes.wave[i3], shapes.torus[i3], t);
        targetY = THREE.MathUtils.lerp(shapes.wave[i3 + 1], shapes.torus[i3 + 1], t);
        targetZ = THREE.MathUtils.lerp(shapes.wave[i3 + 2], shapes.torus[i3 + 2], t);
      }

      const px = positionAttr.array[i3];
      const py = positionAttr.array[i3 + 1];
      const pz = positionAttr.array[i3 + 2];

      const dx = px - mouse3D.x;
      const dy = py - mouse3D.y;
      const dz = pz - mouse3D.z;

      // Squared distance calculation (No Math.sqrt here!)
      const distSq = dx * dx + dy * dy + dz * dz;

      let forceX = 0, forceY = 0, forceZ = 0;

      // Only perform heavy square root calculation if particle is within squared radius
      if (distSq < radiusSq) {
        const distance = Math.sqrt(distSq); // Calculated ONLY for ~2% of particles close to mouse
        const normalizedForce = (repulsionRadius - distance) / repulsionRadius;
        forceX = (dx / (distance || 1)) * normalizedForce * repulsionStrength;
        forceY = (dy / (distance || 1)) * normalizedForce * repulsionStrength;
        forceZ = (dz / (distance || 1)) * normalizedForce * repulsionStrength;
      }

      positionAttr.array[i3] = THREE.MathUtils.lerp(px, targetX + forceX, 0.1);
      positionAttr.array[i3 + 1] = THREE.MathUtils.lerp(py, targetY + forceY, 0.1);
      positionAttr.array[i3 + 2] = THREE.MathUtils.lerp(pz, targetZ + forceZ, 0.1);
    }
    positionAttr.needsUpdate = true;

    // D. Ambient background dust drift (Optimized)
    if (dustRef.current) {
      dustRef.current.rotation.y = elapsedTime * 0.01;
      dustRef.current.rotation.x = elapsedTime * 0.005;
    }

    // E. Physical Spatial Translation (Unchanged)
    let groupX = 0, groupY = 0, groupZ = 0;

    if (isMobile) {
      if (scrollOffset < 0.5) {
        const t = scrollOffset * 2.0;
        groupY = THREE.MathUtils.lerp(0, -0.8, t);
      } else {
        const t = (scrollOffset - 0.5) * 2.0;
        groupY = THREE.MathUtils.lerp(-0.8, 0.8, t);
        groupZ = THREE.MathUtils.lerp(0, -0.5, t);
      }
    } else {
      if (scrollOffset < 0.5) {
        const t = scrollOffset * 2.0;
        groupX = THREE.MathUtils.lerp(0, 1.4, t);
        groupY = THREE.MathUtils.lerp(0, -0.2, t);
      } else {
        const t = (scrollOffset - 0.5) * 2.0;
        groupX = THREE.MathUtils.lerp(1.4, -1.4, t);
        groupY = THREE.MathUtils.lerp(-0.2, 0.3, t);
        groupZ = THREE.MathUtils.lerp(0, -0.6, t);
      }
    }

    points.position.x = THREE.MathUtils.lerp(points.position.x, groupX, 0.06);
    points.position.y = THREE.MathUtils.lerp(points.position.y, groupY, 0.06);
    points.position.z = THREE.MathUtils.lerp(points.position.z, groupZ, 0.06);

    // F. Detect active page (Unchanged)
    let activePage = 'home';
    if (scrollOffset > 0.3 && scrollOffset <= 0.7) {
      activePage = 'work';
    } else if (scrollOffset > 0.7) {
      activePage = 'contact';
    }

    if (activePage !== lastActivePage.current) {
      lastActivePage.current = activePage;
      setPage(activePage);
    }

    // G. Camera tilt parallax (Optimized and smoothed)
    const tiltFactor = isMobile ? 0.03 : 0.08;
    points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, state.pointer.y * tiltFactor, 0.05);
    points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, state.pointer.x * tiltFactor + elapsedTime * 0.015, 0.05);
  });

  return (
    <group>
      {/* 1. Main Interactive Morphing Particles */}
      <points ref={pointsRef} scale={responsiveScale}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[shapes.sphere, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c084fc"
          size={particleSize}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Secondary Background Floating Volumetric Dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#a78bfa"
          size={isMobile ? 0.025 : 0.018}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
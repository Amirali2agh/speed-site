import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// 1. Math generators (Unchanged)
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

// 2. Immersive Particles with Advanced Spatial Shift
export default function ImmersiveParticles({ count = 3600, setPage, setScrollEl }) {
  const pointsRef = useRef(null);
  const scroll = useScroll();
  const { size } = useThree();
  const isMobile = size.width < 768;

  const lastActivePage = useRef('home');

  const shapes = useMemo(() => ({
    sphere: getSpherePositions(count),
    wave: getWavePositions(count),
    torus: getTorusPositions(count),
    current: new Float32Array(count * 3)
  }), [count]);

  const responsiveScale = isMobile ? 0.75 : 1.1;
  const particleSize = isMobile ? 0.045 : 0.025;

  // Sync scroll element reference
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

    // A. Vertex Morphing (Shape transformation)
    for (let i = 0; i < count * 3; i++) {
      let targetValue = 0;
      if (scrollOffset < 0.5) {
        const t = scrollOffset * 2.0;
        targetValue = THREE.MathUtils.lerp(shapes.sphere[i], shapes.wave[i], t);
      } else {
        const t = (scrollOffset - 0.5) * 2.0;
        targetValue = THREE.MathUtils.lerp(shapes.wave[i], shapes.torus[i], t);
      }
      positionAttr.array[i] = THREE.MathUtils.lerp(positionAttr.array[i], targetValue, 0.08);
    }
    positionAttr.needsUpdate = true;

    // B. Physical 3D Spatial Translation (Moving the mesh in space based on scroll)
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    if (isMobile) {
      // Mobile Layout: Shift up and down vertically so text doesn't overlap particles
      if (scrollOffset < 0.5) {
        const t = scrollOffset * 2.0;
        targetY = THREE.MathUtils.lerp(0, -0.8, t); // Pushes particles down for Section 2
      } else {
        const t = (scrollOffset - 0.5) * 2.0;
        targetY = THREE.MathUtils.lerp(-0.8, 0.8, t); // Pulls particles up for Section 3
        targetZ = THREE.MathUtils.lerp(0, -0.5, t);
      }
    } else {
      // Desktop Layout: Shift left and right horizontally for asymmetrical designs
      if (scrollOffset < 0.5) {
        const t = scrollOffset * 2.0;
        targetX = THREE.MathUtils.lerp(0, 1.4, t); // Shifts particles to the right for Section 2
        targetY = THREE.MathUtils.lerp(0, -0.2, t);
      } else {
        const t = (scrollOffset - 0.5) * 2.0;
        targetX = THREE.MathUtils.lerp(1.4, -1.4, t); // Shifts particles to the left for Section 3
        targetY = THREE.MathUtils.lerp(-0.2, 0.3, t);
        targetZ = THREE.MathUtils.lerp(0, -0.6, t);
      }
    }

    // Apply smooth linear interpolations to the physical group position
    points.position.x = THREE.MathUtils.lerp(points.position.x, targetX, 0.06);
    points.position.y = THREE.MathUtils.lerp(points.position.y, targetY, 0.06);
    points.position.z = THREE.MathUtils.lerp(points.position.z, targetZ, 0.06);

    // C. Detect active page and update UI
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

    // D. Fluid mouse interactions with parallax rotation
    const hoverFactor = isMobile ? 0.1 : 0.25;
    points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, state.pointer.y * hoverFactor, 0.05);
    points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, state.pointer.x * hoverFactor + state.clock.getElapsedTime() * 0.03, 0.05);
  });

  return (
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
  );
}
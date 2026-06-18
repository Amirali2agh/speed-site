import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import ImmersiveParticles from './components/ImmersiveParticles';
import Navbar from './components/navbar';

export default function App() {
  const [currentPage, setPage] = useState('home');
  const [scrollEl, setScrollEl] = useState(null);

  return (
    <main className="relative w-full h-screen bg-slate-950 text-white overflow-hidden">
      {/* Global persistent navigation bar */}
      <Navbar currentPage={currentPage} setPage={setPage} scrollEl={scrollEl} />

      {/* Interactive 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.4} />
          <ScrollControls pages={3} damping={0.25}>
            
            {/* Immersive Responsive Morphing/Shifting Particles */}
            <ImmersiveParticles 
              count={4000} 
              setPage={setPage} 
              setScrollEl={setScrollEl} 
            />
            
            {/* DOM Scroll layer with balanced responsive layouts */}
            <Scroll html>
              
              {/* Section 1: HOME (Centered Layout) */}
              <div className="w-screen h-screen flex flex-col justify-center items-center px-6 md:px-12 pointer-events-none">
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 drop-shadow-md">
                  THE ORIGIN
                </h1>
                <p className="text-slate-400 mt-4 text-center max-w-xs sm:max-w-md text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                  We begin as a unified sphere. Scroll down or click the menu to disperse the structural grid into waves of pure fluid data.
                </p>
              </div>

              {/* Section 2: WORK (Asymmetrical Left Layout on Desktop) */}
              {/* On desktop: flex items are aligned to the left (md:items-start md:text-left) because particles shift to the right */}
              <div className="w-screen h-screen flex flex-col justify-center items-center md:items-start px-6 md:px-24 pointer-events-none">
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 drop-shadow-md">
                  PORTFOLIO
                </h1>
                <p className="text-slate-400 mt-4 text-center md:text-left max-w-xs sm:max-w-md text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                  This is where waves of logic and data shape into real digital products. Hover and drag to interact with the terrain mesh.
                </p>
              </div>

              {/* Section 3: CONTACT (Asymmetrical Right Layout on Desktop) */}
              {/* On desktop: flex items are aligned to the right (md:items-end md:text-right) because particles shift to the left */}
              <div className="w-screen h-screen flex flex-col justify-center items-center md:items-end px-6 md:px-24 pointer-events-none">
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 drop-shadow-md">
                  CONNECT
                </h1>
                <p className="text-slate-400 mt-4 text-center md:text-right max-w-xs sm:max-w-md text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                  Our paths converge here. Reach out to collaborate or discuss building the next generation of custom creative systems.
                </p>
              </div>

            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
    </main>
  );
}
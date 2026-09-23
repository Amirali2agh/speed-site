import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import ImmersiveParticles from './components/ImmersiveParticles';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';

export default function App() {
  const [currentPage, setPage] = useState('home');
  const [scrollEl, setScrollEl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Tracks when the preloader has finished its exit animation

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particleCount = isMobile ? 800 : 1600;

  return (
    <main className="relative w-full h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* 1. Cinematic Preloader covering the screen */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* 2. Global persistent navigation - Fades in gracefully after the preloader exits */}
      <div className={`transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar currentPage={currentPage} setPage={setPage} scrollEl={scrollEl} />
      </div>

      {/* Interactive 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }} dpr={1}>
          <ambientLight intensity={0.4} />
          
          <ScrollControls pages={3} damping={0.25}>
            <ImmersiveParticles 
              count={particleCount} 
              setPage={setPage} 
              setScrollEl={setScrollEl} 
            />
            
            {/* HTML scroll layer - Content slides in gracefully after the preloader exits */}
            <Scroll html>
              
              {/* Section 1: HOME */}
              <div className="w-screen h-screen flex flex-col justify-center items-center px-6 md:px-12 pointer-events-none">
                <div className={`flex flex-col items-center text-center transition-all duration-1000 delay-500 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                  <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 drop-shadow-md">
                    THE ORIGIN
                  </h1>
                  <p className="text-slate-400 mt-4 max-w-xs sm:max-w-md text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                    We begin as a unified sphere. Scroll down or click the menu to disperse the structural grid into waves of pure fluid data.
                  </p>
                </div>
              </div>

              {/* Section 2: WORK */}
              <div className="w-screen h-screen flex flex-col justify-center items-center md:items-start px-6 md:px-24 pointer-events-none">
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 drop-shadow-md">
                  PORTFOLIO
                </h1>
                <p className="text-slate-400 mt-4 text-center md:text-left max-w-xs sm:max-w-md text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                  This is where waves of logic and data shape into real digital products. Hover and drag to interact with the terrain mesh.
                </p>
              </div>

              {/* Section 3: CONTACT */}
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

          {!isMobile && (
            <EffectComposer disableNormalPass>
              <Bloom 
                intensity={0.9} 
                luminanceThreshold={0.15} 
                luminanceSmoothing={0.9} 
                height={200} 
                mipmapBlur 
              />
              <ToneMapping mode={3} />
            </EffectComposer>
          )}

        </Canvas>
      </div>
    </main>
  );
}
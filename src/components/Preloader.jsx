import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

export default function Preloader({ onComplete }) {
  const { progress, active } = useProgress();
  const [localProgress, setLocalProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [unmount, setUnmount] = useState(false);

  // Smooth out the percentage counter so it crawls naturally instead of flashing instantly
  useEffect(() => {
    let timer;
    if (localProgress < progress) {
      // Increment the counter smoothly
      timer = setTimeout(() => setLocalProgress((prev) => Math.min(prev + 1, progress)), 12);
    } else if (!active && localProgress >= 100) {
      // Once loaded, trigger the fade-out timeline
      const fadeTimer = setTimeout(() => {
        setShow(false); // Triggers the Tailwind opacity transition
        onComplete();   // Notifies the parent component to fade-in the UI and Navbar
        
        // Completely remove the loader from the DOM after the animation finishes
        setTimeout(() => setUnmount(true), 800);
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
    return () => clearTimeout(timer);
  }, [progress, localProgress, active, onComplete]);

  if (unmount) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-all duration-700 ease-in-out ${
        show ? 'opacity-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}
    >
      {/* Sleek rotating ring decoration wrapping the numeric percentage */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-violet-500/10 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <span className="text-xl font-bold tracking-widest text-slate-300">
          {Math.round(localProgress)}%
        </span>
      </div>

      {/* Futuristic status text indicator */}
      <h2 className="text-[10px] tracking-[0.3em] font-semibold text-slate-400 uppercase animate-pulse">
        Initializing Creative Matrix...
      </h2>
    </div>
  );
}
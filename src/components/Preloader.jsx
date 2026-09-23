import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export default function Preloader({ onComplete }) {
  const { progress, active } = useProgress();
  const [localProgress, setLocalProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    let timer;

    if (localProgress < progress) {
      timer = setTimeout(() => {
        setLocalProgress((prev) => Math.min(prev + 1, progress));
      }, 12);
    } else if (!active && localProgress >= 100 && show) {
      const fadeTimer = setTimeout(() => {
        setShow(false);
        onComplete();
        setTimeout(() => setUnmount(true), 800);
      }, 500);

      return () => clearTimeout(fadeTimer);
    }

    return () => clearTimeout(timer);
  }, [progress, localProgress, active, show, onComplete]);

  if (unmount) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-all duration-700 ease-in-out ${
        show ? 'opacity-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}
    >
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-400/10 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-t-violet-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <span className="text-xl font-bold tracking-widest text-slate-300">
          {Math.round(localProgress)}%
        </span>
      </div>

      <h2 className="text-[10px] tracking-[0.3em] font-semibold text-slate-400 uppercase animate-pulse">
        Initializing Speed Service...
      </h2>
    </div>
  );
}

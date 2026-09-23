import React, { useEffect, useState } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    let progressTimer;
    let finishTimer;
    let unmountTimer;

    progressTimer = setInterval(() => {
      setProgress((previous) => {
        const next = Math.min(previous + (previous < 70 ? 4 : 2), 100);
        if (next >= 100) {
          clearInterval(progressTimer);
          finishTimer = setTimeout(() => {
            setShow(false);
            onComplete();
            unmountTimer = setTimeout(() => setUnmount(true), 750);
          }, 250);
        }
        return next;
      });
    }, 24);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(finishTimer);
      clearTimeout(unmountTimer);
    };
  }, [onComplete]);

  if (unmount) return null;

  return (
    <div dir="rtl" className={'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-all duration-700 ease-in-out ' + (show ? 'opacity-100' : 'opacity-0 scale-105 pointer-events-none')}>
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-400/10 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-t-violet-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <span className="text-xl font-bold tracking-widest text-slate-300" dir="ltr">{progress}%</span>
      </div>
      <h2 className="text-[10px] md:text-xs tracking-[0.18em] font-semibold text-slate-400 animate-pulse">در حال آماده‌سازی Speed Service...</h2>
    </div>
  );
}

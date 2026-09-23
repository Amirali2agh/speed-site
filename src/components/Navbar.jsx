import React from 'react';

// Navigation is intentionally lightweight so it stays responsive over the WebGL layer.
export default function Navbar({ currentPage, setPage, scrollEl }) {
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'protocols', label: 'Protocols' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavigation = (item, index) => {
    if (scrollEl) {
      scrollEl.scrollTo({
        top: index * scrollEl.clientHeight,
        behavior: 'smooth',
      });
    }
    setPage(item.id);
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-7 pointer-events-auto">
      <button
        type="button"
        className="text-xl md:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 cursor-pointer"
        onClick={() => handleNavigation(menuItems[0], 0)}
        aria-label="Go to Speed Service home"
      >
        SPEED SERVICE
      </button>

      <div className="flex gap-3 sm:gap-5 md:gap-8">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavigation(item, index)}
            className={`text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.14em] uppercase cursor-pointer transition-all duration-300 pb-1 ${currentPage === item.id
              ? 'text-cyan-300 border-b border-cyan-300'
              : 'text-slate-400 hover:text-white'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

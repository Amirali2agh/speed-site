import React from 'react';

// Navbar accepts currentPage state, setPage state, and the physical scroll container reference
export default function Navbar({ currentPage, setPage, scrollEl }) {
  const menuItems = ['home', 'work', 'contact'];

  // Smoothly scrolls the WebGL container to the target section based on index
  const handleNavigation = (item, index) => {
    if (scrollEl) {
      scrollEl.scrollTo({
        top: index * scrollEl.clientHeight, // Each section is exactly 100vh of the container height
        behavior: 'smooth' // Triggers native smooth animation
      });
      setPage(item); // Optimistically set local state
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-8 pointer-events-auto">
      {/* Brand logo */}
      <div 
        className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 cursor-pointer"
        onClick={() => handleNavigation('home', 0)}
      >
        CREATIVE.LAB
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 md:gap-10">
        {menuItems.map((item, index) => (
          <button
            key={item}
            onClick={() => handleNavigation(item, index)}
            className={`text-xs md:text-sm font-semibold tracking-widest uppercase cursor-pointer transition-all duration-300 pb-1 ${
              currentPage === item 
                ? 'text-pink-400 border-b border-pink-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}
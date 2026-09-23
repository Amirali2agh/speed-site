import React from 'react';

export default function Navbar({ currentPage, setPage, scrollEl }) {
  const menuItems = [
    { id: 'home', label: 'خانه' },
    { id: 'services', label: 'خدمات' },
    { id: 'protocols', label: 'پروتکل‌ها' },
    { id: 'contact', label: 'ارتباط' },
  ];

  const handleNavigation = (item, index) => {
    if (scrollEl) scrollEl.scrollTo({ top: index * scrollEl.clientHeight, behavior: 'smooth' });
    setPage(item.id);
  };

  return (
    <nav dir="rtl" className="absolute top-0 left-0 w-full z-50 flex justify-between items-center gap-6 px-5 md:px-12 py-6 pointer-events-auto">
      <button type="button" className="shrink-0 text-lg md:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 cursor-pointer" onClick={() => handleNavigation(menuItems[0], 0)} aria-label="رفتن به صفحه اصلی Speed Service">
        <span dir="ltr">SPEED SERVICE</span>
      </button>
      <div className="flex flex-wrap justify-end gap-x-3 gap-y-2 sm:gap-x-5 md:gap-x-8">
        {menuItems.map((item, index) => (
          <button key={item.id} type="button" onClick={() => handleNavigation(item, index)} className={'text-[10px] sm:text-xs md:text-sm font-semibold cursor-pointer transition-all duration-300 pb-1 ' + (currentPage === item.id ? 'text-cyan-300 border-b border-cyan-300' : 'text-slate-400 hover:text-white')}>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

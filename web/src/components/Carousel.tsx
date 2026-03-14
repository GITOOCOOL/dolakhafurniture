"use client";

import React, { useRef, useState, useEffect } from 'react';

const Carousel = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({ 
        left: direction === 'right' ? scrollAmount : -scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="flex-1 relative group w-full px-0 overflow-visible">
      {/* Updated Animations: Slower 'Drift' for a calmer vibe */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes drift-x-left { 0%, 100% { transform: translateX(0); opacity: 0.4; } 50% { transform: translateX(-6px); opacity: 0.8; } }
        @keyframes drift-x-right { 0%, 100% { transform: translateX(0); opacity: 0.4; } 50% { transform: translateX(6px); opacity: 0.8; } }
        .animate-drift-left { animation: drift-x-left 2.5s ease-in-out infinite; }
        .animate-drift-right { animation: drift-x-right 2.5s ease-in-out infinite; }
      `}</style>
      
      {/* LEFT ARROW - Changed from Stone/Orange to Cream/Terracotta */}
      <button 
        onClick={() => scroll('left')}
        className={`absolute -left-2 md:left-0 top-0 bottom-8 flex items-center justify-start
                   z-40 pointer-events-auto transform-gpu
                   bg-gradient-to-r from-[#fdfaf5]/95 via-transparent to-transparent 
                   transition-all duration-500
                   ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transform: 'translateZ(0)', width: '48px' }}
      >
        <span className="text-7xl md:text-7xl font-serif italic text-[#a3573a] drop-shadow-sm animate-drift-left">
          ‹
        </span>
        <span className="text-7xl md:text-7xl font-serif italic text-[#a3573a] drop-shadow-sm animate-drift-left">
          ‹
        </span>
      </button>

      {/* THE CONTAINER - Layout kept identical, fixed vertical scroll with touch-pan-y */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-3 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar scroll-smooth w-full touch-pan-x touch-pan-y"
      >
        {React.Children.map(children, (child) => (
          <div className="
            min-w-[calc(50%-6px)] 
            md:min-w-[calc(33.33%-22px)] 
            lg:min-w-[calc(25%-24px)] 
            snap-start
          ">
            {child}
          </div>
        ))}
      </div>

      {/* RIGHT ARROW - Changed from Stone/Orange to Cream/Terracotta */}
      <button 
        onClick={() => scroll('right')}
        className={`absolute -right-2 md:right-0 top-0 bottom-8 flex items-center justify-end
                   z-40 pointer-events-auto transform-gpu
                   bg-gradient-to-l from-[#fdfaf5]/95 via-transparent to-transparent 
                   transition-all duration-500
                   ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transform: 'translateZ(0)', width: '48px' }}
      >
        <span className="text-7xl md:text-7xl font-serif italic text-[#a3573a] drop-shadow-sm animate-drift-right">
          ›
        </span>
        <span className="text-7xl md:text-7xl font-serif italic text-[#a3573a] drop-shadow-sm animate-drift-right">
          ›
        </span>
      </button>
    </div>
  );
};

export default Carousel;

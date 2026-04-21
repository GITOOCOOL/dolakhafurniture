"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  
  const [currentScrollLeft, setCurrentScrollLeft] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);

  const childrenArray = React.Children.toArray(children);
  // Disabled the infinite cloning hack to prevent double-displaying products
  const infiniteChildren = childrenArray;

  // SYNC SCROLL -> SCRUBBER
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleNativeScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      
      setCurrentScrollLeft(scrollLeft);
      setMaxScroll(scrollWidth - clientWidth);

      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);

      if (scrollLeft > 20 && !hasUserScrolled) {
        setHasUserScrolled(true);
      }
    };

    el.addEventListener('scroll', handleNativeScroll, { passive: true });
    setTimeout(handleNativeScroll, 500); 
    
    return () => el.removeEventListener('scroll', handleNativeScroll);
  }, [hasUserScrolled]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    setHasUserScrolled(true);
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({ 
        left: direction === 'right' ? scrollAmount : -scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setHasUserScrolled(true);

    if (scrollRef.current) {
      scrollRef.current.scrollLeft = value;
    }
  };

  return (
    <div ref={containerRef} className="flex-1 relative group w-full px-0 overflow-visible flex flex-col gap-2">
      <style>{`
        /* Card width injection for responsive sizing */
        :root { --card-width: 60%; }
        @media (min-width: 768px) { :root { --card-width: 18%; } }
        @media (min-width: 1024px) { :root { --card-width: 18%; } }
      `}</style>
        <div 
          ref={scrollRef}
          onMouseDown={() => {
              setHasUserScrolled(true);
          }}
          className="flex gap-4 md:gap-8 lg:gap-12 overflow-x-auto pb-6 no-scrollbar w-full touch-pan-x touch-pan-y scroll-smooth"
        >
          {infiniteChildren.map((child, index) => {
            const safeKey = (child as React.ReactElement)?.key || `carousel-item-${index}`;
            return (
              <div 
                key={safeKey} 
                className="flex-shrink-0"
                style={{ 
                  minWidth: "calc(var(--card-width) - 8px)",
                  width: "calc(var(--card-width) - 8px)"
                }}
              >
                {child}
              </div>
            );
          })}
        </div>

      {/* REPOSITIONED FOOTER CONTROLS AREA */}
      <div className="flex flex-col items-center gap-1 w-full px-4 mb-4 mt-2">
        
        {/* UNIFIED NAV DECK: [‹] [---SCRUBBER---] [›] */}
        <div className="flex items-center justify-between w-full max-w-[320px] gap-4 pt-2">
          <button 
            onClick={() => scrollByAmount('left')}
            className="hidden md:flex text-action hover:opacity-70 active:scale-90 transition-all"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="flex-1 flex items-center h-4">
             <input 
                type="range"
                min="0"
                max={maxScroll}
                value={currentScrollLeft}
                onChange={handleScrub}
                className="boho-scrubber"
             />
          </div>

          <button 
            onClick={() => scrollByAmount('right')}
            className="hidden md:flex text-action hover:opacity-70 active:scale-90 transition-all"
            aria-label="Scroll Right"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;

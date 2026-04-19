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
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        
        .boho-scrubber {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        .boho-scrubber:focus { outline: none; }
        .boho-scrubber::-webkit-slider-runnable-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          background: #3d2b1f20;
          border-radius: 2px;
        }
        .boho-scrubber::-moz-range-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          background: #3d2b1f20;
          border-radius: 2px;
        }
        .boho-scrubber::-webkit-slider-thumb {
          height: 10px;
          width: 40px;
          border-radius: 5px;
          background: #a3573a;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -4px;
          box-shadow: 0 0 5px rgba(163,87,58,0.3);
        }
        .boho-scrubber::-moz-range-thumb {
          height: 10px;
          width: 40px;
          border-radius: 5px;
          background: #a3573a;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 5px rgba(163,87,58,0.3);
        }
      `}</style>
      
      <div className="relative w-full">
        <div 
          ref={scrollRef}
          onMouseDown={() => {
              setHasUserScrolled(true);
          }}
          className="flex gap-4 md:gap-8 lg:gap-12 overflow-x-auto pb-6 no-scrollbar w-full touch-pan-x touch-pan-y scroll-smooth"
        >
          {infiniteChildren.map((child, index) => (
            <div key={index} className="min-w-[calc(15%-8px)] md:min-w-[calc(25%-24px)] lg:min-w-[calc(25%-36px)] flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* REPOSITIONED FOOTER CONTROLS AREA */}
      <div className="flex flex-col items-center gap-1 w-full px-4 mb-4 mt-2">
        
        {/* UNIFIED NAV DECK: [‹] [---SCRUBBER---] [›] */}
        <div className="flex items-center justify-between w-full max-w-[320px] gap-4 pt-2">
          <button 
            onClick={() => scrollByAmount('left')}
            className="hidden md:flex text-[#a3573a] hover:opacity-70 active:scale-90 transition-all"
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
            className="hidden md:flex text-[#a3573a] hover:opacity-70 active:scale-90 transition-all"
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

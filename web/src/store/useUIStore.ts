"use client";

import { create } from 'zustand';

interface UIStore {
  activeLocks: Set<string>;
  scrollPos: number;
  lockScroll: (id: string) => void;
  unlockScroll: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeLocks: new Set<string>(),
  scrollPos: 0,
  
  lockScroll: (id: string) => set((state) => {
    const next = new Set(state.activeLocks);
    next.add(id);
    
    if (typeof document !== 'undefined') {
      // If this is the FIRST lock, capture scroll and pin the body for iOS resilience
      if (state.activeLocks.size === 0) {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        return { activeLocks: next, scrollPos: scrollY };
      }
    }
    
    return { activeLocks: next };
  }),
  
  unlockScroll: (id: string) => set((state) => {
    const next = new Set(state.activeLocks);
    next.delete(id);
    
    if (typeof document !== 'undefined' && next.size === 0) {
      // If this is the LAST unlock, restore body and jump back to previous position
      const savedPos = state.scrollPos;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Use standard scrollTo to ensure immediate jump
      window.scrollTo(0, savedPos);
      return { activeLocks: next, scrollPos: 0 };
    }
    
    return { activeLocks: next };
  }),
}));

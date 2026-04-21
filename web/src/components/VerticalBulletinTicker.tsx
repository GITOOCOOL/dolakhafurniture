"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bulletin as BulletinType } from '@/types/bulletin';

// Items enter from bottom, move up, then exit top
const bulletinVariants = {
  enter: { y: '50%', opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: '-50%', opacity: 0 },
};

export default function VerticalBulletinTicker({ bulletins = [] }: { bulletins: BulletinType[] }) {
  const [bulletinIndex, setBulletinIndex] = useState(0);

  useEffect(() => {
    if (!bulletins || bulletins.length <= 1) return;

    const timer = setInterval(() => {
      setBulletinIndex((prev) => (prev + 1) % bulletins.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [bulletins?.length]);

  if (!bulletins || bulletins.length === 0) return null;

  return (
    <div className="w-full h-full relative overflow-hidden bg-app text-heading border-r border-soft hidden lg:flex flex-col items-center py-12">
      
      {/* Label: Fixed at the very top */}
      <div className="text-[9px] font-sans font-bold uppercase tracking-[0.4em] text-action rotate-90 origin-center whitespace-nowrap mb-16">
        Latest News
      </div>

      <div className="flex-1 w-full relative flex flex-col items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={bulletinIndex}
            variants={bulletinVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 1.2 }}
            className="absolute inset-x-0 flex flex-col items-center justify-center p-2"
          >
            {/* The actual content: Rotated 90 degrees to fit the 80px width */}
            <div className="rotate-90 origin-center whitespace-nowrap flex flex-col items-center gap-4">
              <h3 className="text-lg md:text-xl font-serif italic text-heading">
                {bulletins[bulletinIndex].title}
              </h3>
              <p className="text-[10px] font-sans font-medium text-label uppercase tracking-widest max-w-[200px] text-center">
                {bulletins[bulletinIndex].content}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Label: Fixed at the bottom */}
      <div className="text-[9px] font-sans font-bold uppercase tracking-[0.4em] text-action rotate-90 origin-center whitespace-nowrap mt-16">
        Dolakha Furniture
      </div>
    </div>
  );
}

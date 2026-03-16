"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Bulletin from '@/components/Bulletin';
import { Bulletin as BulletinType } from '@/types/bulletin';

const bulletinVariants = {
  enter: { x: '-100%' },
  center: { x: 0 },
  exit: { x: '100%' },
};

export default function BulletinTicker({ bulletins = [] }: { bulletins: BulletinType[] }) {
  const [bulletinIndex, setBulletinIndex] = useState(0);

  useEffect(() => {
    if (!bulletins || bulletins.length <= 1) return;

    const timer = setInterval(() => {
      setBulletinIndex((prev) => (prev + 1) % (bulletins?.length || 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [bulletins?.length]);

  if (!bulletins || bulletins.length === 0) return null;

  return (
    <div className="w-full h-28 relative overflow-hidden bg-[#fdfaf5] border-b border-[#e5dfd3] border-dotted z-40 rounded-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={bulletinIndex}
          variants={bulletinVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", ease: "linear", duration: 2.5 }}
          className="relative w-full h-full flex items-center justify-center p-2 rounded-full"
        >
          {bulletins[bulletinIndex] && (
            <Bulletin
              title={bulletins[bulletinIndex].title}
              content={bulletins[bulletinIndex].content}
              slug={bulletins[bulletinIndex].slug}
              color={bulletins[bulletinIndex].bulletinType === 'news' ? '#0d00ff' : '#d95518ff'}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

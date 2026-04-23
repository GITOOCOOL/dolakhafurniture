'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ShoppingBag, ExternalLink } from 'lucide-react';
import { SocialContent } from '@/types';
import { urlFor } from '@/lib/sanity';

interface ReelsSectionProps {
  reels: SocialContent[];
}

export default function ReelsSection({ reels }: ReelsSectionProps) {
  const [hoveredReel, setHoveredReel] = useState<string | null>(null);

  if (reels.length === 0) return null;

  return (
    <section className="w-full py-16 bg-app border-t border-soft">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="type-label text-label mb-2">Dolakha Studio</p>
            <h2 className="text-4xl font-serif italic tracking-tight text-heading">
              House Tours & Reels
            </h2>
          </div>
          <p className="text-label max-w-md text-sm md:text-right">
            Get a closer look at our craftsmanship and how our pieces fit into real homes.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {reels.map((reel) => (
            <ReelCard 
              key={reel._id} 
              reel={reel} 
              isHovered={hoveredReel === reel._id}
              onHover={() => setHoveredReel(reel._id)}
              onLeave={() => setHoveredReel(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReelCard({ reel, isHovered, onHover, onLeave }: { 
  reel: SocialContent; 
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-soft group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-soft"
    >
      {/* Thumbnail or First Frame Fallback */}
      {reel.thumbnailUrl ? (
        <Image
          src={reel.thumbnailUrl}
          alt={reel.title}
          fill
          className={`object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : (
        !isHovered && reel.videoUrl && (
          <video
            src={`${reel.videoUrl}#t=0.001`}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
          />
        )
      )}

      {/* Video Preview */}
      {reel.videoUrl && (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Play Icon (Visible when not hovered) */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      )}

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
        <h3 className="text-white font-medium text-sm md:text-base leading-tight mb-1">
          {reel.title}
        </h3>
        
        {/* Linked Products (Bottom Indicator) */}
        {reel.linkedProducts && reel.linkedProducts.length > 0 && (
          <div className="flex -space-x-2 mt-2">
            {reel.linkedProducts.slice(0, 3).map((product) => (
              <div 
                key={product._id}
                className="w-6 h-6 rounded-full border-2 border-app overflow-hidden bg-white"
              >
                <img 
                  src={urlFor(product.mainImage).width(50).url()} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {reel.linkedProducts.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-app bg-soft flex items-center justify-center text-[8px] font-bold">
                +{reel.linkedProducts.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Hover Tooltip */}
      <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        {reel.externalUrl && (
          <a 
            href={reel.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white border border-white/30 hover:bg-white/40 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

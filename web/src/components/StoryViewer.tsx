"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Play, Pause } from "lucide-react";
import { SocialContent } from "@/types";
import Modal from "./ui/Modal";

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  items: SocialContent[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function StoryViewer({
  isOpen,
  onClose,
  items,
  activeIndex,
  onNavigate,
}: StoryViewerProps) {
  const current = items[activeIndex];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Reset progress and play state when items change
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
  }, [activeIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration > 0) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title="Live Feed"
      id="social-story-modal"
      noPadding
      className="!bg-black !border-soft/20 !h-full sm:!h-[95dvh] !rounded-none sm:!rounded-t-[3rem]"
    >
      <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
        {current && (
          <div className="relative w-full h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Play/Pause Overlay */}
            <div 
              className="absolute inset-0 z-40 bg-transparent flex items-center justify-center cursor-pointer group"
              onClick={togglePlay}
            >
              <div className={`p-6 rounded-full bg-black/40 backdrop-blur-md text-white transition-all duration-300 ${isPlaying ? 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100' : 'opacity-100 scale-100'}`}>
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </div>
            </div>

            <div className="relative flex-1 bg-black flex flex-col items-center justify-center">
              {current.videoUrl ? (
                <video
                  ref={videoRef}
                  key={current.videoUrl}
                  src={current.videoUrl}
                  autoPlay
                  playsInline
                  loop
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  Video unavailable
                </div>
              )}

              {/* INTEGRATED TIMELINE (TOP) */}
              <div className="absolute top-4 left-4 right-4 flex gap-1 h-[2px] z-50">
                {items.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-white/20 overflow-hidden"
                  >
                    {i === activeIndex && (
                      <div 
                        className="h-full bg-action shadow-[0_0_10px_rgba(var(--action-rgb),0.8)]"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                    {i < activeIndex && (
                      <div className="h-full bg-white/80" />
                    )}
                  </div>
                ))}
              </div>

              {/* Caption / Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-20 pointer-events-auto">
                <h3 className="text-white font-serif text-2xl mb-2">
                  {current.title}
                </h3>
                {current.caption && (
                  <p className="text-white/80 text-sm mb-6 line-clamp-3 max-w-md">
                    {current.caption}
                  </p>
                )}

                <div className="flex gap-3 relative z-50">
                  {current.externalUrl && (
                    <a
                      href={current.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs backdrop-blur-md transition-all border border-white/10 font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <ExternalLink size={14} />
                      View Social
                    </a>
                  )}

                  {current.linkedProducts &&
                    current.linkedProducts!.length > 0 && (
                      <div className="flex items-center gap-2 px-6 py-3 bg-action text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg cursor-pointer">
                        <ShoppingBag size={14} />
                        Shop Look
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Navigation Arrows (Visible on Desktop) */}
            <button
              disabled={activeIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(activeIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white disabled:invisible hidden md:block z-50 cursor-pointer"
            >
              ←
            </button>
            <button
              disabled={activeIndex === items.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(activeIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white disabled:invisible hidden md:block z-50 cursor-pointer"
            >
              →
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShoppingBag } from "lucide-react";
import { SocialContent } from "@/types";

interface SocialStoriesProps {
  stories: SocialContent[];
}

export default function SocialStories({ stories }: SocialStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  if (stories.length === 0) return null;

  return (
    <div className="w-full py-4 border-b border-soft">
      <div className="container mx-auto px-6">
        <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2">
          {stories.map((story, index) => (
            <div
              key={story._id}
              onClick={() => setSelectedStory(index)}
              className="flex-shrink-0 cursor-pointer group"
            >
              <div className="relative p-0.5 rounded-full border-2 border-action/40 group-hover:border-action transition-colors">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-app bg-soft">
                  {story.thumbnailUrl ? (
                    <Image
                      src={story.thumbnailUrl}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-label">
                      Video
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-center mt-2 text-label font-medium truncate w-16 md:w-20">
                {story.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Story Viewer */}
      <AnimatePresence>
        {selectedStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-6 right-6 z-[110] p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X size={24} />
            </button>

            {/* Content Container */}
            <div className="relative w-full max-w-md h-[80vh] md:h-[90vh] flex flex-col">
              <div className="relative flex-1 bg-black rounded-xl overflow-hidden shadow-2xl">
                {stories[selectedStory].videoUrl ? (
                  <video
                    src={stories[selectedStory].videoUrl}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Video unavailable
                  </div>
                )}

                {/* Progress Bar (Visual only for now) */}
                <div className="absolute top-2 left-2 right-2 flex gap-1 h-1">
                  {stories.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        i === selectedStory ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Caption / Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-serif text-xl mb-1">
                    {stories[selectedStory].title}
                  </h3>
                  {stories[selectedStory].caption && (
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {stories[selectedStory].caption}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {stories[selectedStory].externalUrl && (
                      <a
                        href={stories[selectedStory].externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs backdrop-blur-md transition-all border border-white/10"
                      >
                        <ExternalLink size={14} />
                        View on Social
                      </a>
                    )}

                    {stories[selectedStory].linkedProducts &&
                      stories[selectedStory].linkedProducts!.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-action text-white rounded-lg text-xs font-semibold shadow-lg">
                          <ShoppingBag size={14} />
                          Shop the look
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows (Visible on Desktop) */}
              <button
                disabled={selectedStory === 0}
                onClick={() => setSelectedStory(selectedStory - 1)}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white disabled:invisible hidden md:block"
              >
                Prev
              </button>
              <button
                disabled={selectedStory === stories.length - 1}
                onClick={() => setSelectedStory(selectedStory + 1)}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white disabled:invisible hidden md:block"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

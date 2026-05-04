"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { SocialContent } from "@/types";
import StoryViewer from "./StoryViewer";

interface SocialStoriesProps {
  stories: SocialContent[];
}

export default function SocialStories({ stories }: SocialStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  if (stories.length === 0) return null;

  return (
    <div className="w-full py-4 border-b border-soft">
      <div className="container mx-auto px-6">
        <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-6 px-6">
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
                      sizes="80px"
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

      <StoryViewer
        isOpen={selectedStory !== null}
        onClose={() => setSelectedStory(null)}
        items={stories}
        activeIndex={selectedStory || 0}
        onNavigate={(index) => setSelectedStory(index)}
      />
    </div>
  );
}

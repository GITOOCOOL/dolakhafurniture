"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Leaf, ArrowRight, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // We could log this to Sentry or an error reporting service here if needed
    console.error("Dolakha Furniture Critical Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center font-sans text-[#3d2b1f] px-6 text-center">
      <div className="space-y-8 max-w-2xl">
        <Leaf size={48} className="mx-auto text-[#a3573a]" />
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif italic text-[#3d2b1f]">
            We hit a slight bump.
          </h2>
          <p className="text-lg font-light italic text-[#a89f91] max-w-md mx-auto">
            Something unexpected happened within our showroom. Our artisans have been notified.
          </p>
        </div>

        <div className="pt-8 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
           <Button 
             onClick={() => reset()} 
             size="lg" 
             variant="outline"
             className="shadow-sm hover:shadow-md transition-all gap-2"
           >
             <RotateCcw size={16} /> Try Again
           </Button>
           
          <Link href="/">
             <Button size="lg" className="shadow-lg hover:shadow-xl transition-all gap-2">
               Return to Showroom <ArrowRight size={16} />
             </Button>
          </Link>
        </div>
        
        {/* Subtle developer debugging code (Only shows if there's a digest code) */}
        {error.digest && (
           <p className="text-[10px] uppercase font-bold tracking-widest text-[#a89f91] opacity-50 pt-10">
             Error Digest: {error.digest}
           </p>
        )}
      </div>
    </div>
  );
}

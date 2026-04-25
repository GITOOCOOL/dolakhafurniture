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
    <div className="min-h-screen bg-app flex flex-col items-center justify-center font-sans text-heading px-6 text-center">
      <div className="space-y-8 max-w-2xl">
        <Leaf size={48} className="mx-auto text-action" />

        <div className="space-y-6">
          <h2 className="text-3xl md:type-section text-heading">
             हामी अझै यो वेभसाइट बनाउँदैछौं।
          </h2>
          <div className="space-y-4 max-w-xl mx-auto">
             <p className="text-xl font-medium text-heading leading-relaxed">
               हामी अझै यो वेबसाइट बनाउँदैछौं र सक्रिय रूपमा यसको मर्मत र सुधार गरिरहेका छौं। त्यसैले केही स-साना समस्याहरू हुन सक्छन्। 
               तर ढुक्क हुनुहोस्, यो साइट ब्राउजिङ गर्न र अर्डर गर्न पूर्ण रूपमा सुरक्षित छ।
             </p>
             <p className="text-sm font-light italic text-label leading-relaxed px-4 opacity-80">
               Something unexpected happened, but we are actively maintaining the site. 
               Rest assured, it remains completely safe for browsing and placing orders.
             </p>
          </div>
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
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all gap-2"
            >
              Return to Showroom <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Subtle developer debugging code (Only shows if there's a digest code) */}
        {error.digest && (
          <p className="text-[10px] uppercase font-bold tracking-widest text-label opacity-50 pt-10">
            Error Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

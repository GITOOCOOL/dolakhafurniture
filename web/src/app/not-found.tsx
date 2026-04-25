import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-center font-sans text-heading px-6 text-center">
      <div className="space-y-8 max-w-2xl">
        <Leaf size={48} className="mx-auto text-action opacity-30" />
        
        <h1 className="text-8xl md:text-9xl font-serif italic text-heading leading-none opacity-20">
          404
        </h1>
        
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
               We are still building and actively maintaining this website, so bear with some minor hiccups. 
               Rest assured, the site is completely safe for browsing and placing orders.
             </p>
          </div>
        </div>

        <div className="pt-8 w-full flex justify-center">
          <Link href="/">
             <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
               Return to Showroom <ArrowRight size={16} className="ml-2" />
             </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

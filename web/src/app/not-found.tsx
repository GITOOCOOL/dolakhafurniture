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
        
        <div className="space-y-4">
          <h2 className="text-3xl md:type-section text-heading">
            This page has wandered off.
          </h2>
          <p className="text-lg font-light italic text-label max-w-md mx-auto">
            The collection or piece you are looking for might have been moved, renamed, or is currently being handcrafted in our workshop.
          </p>
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

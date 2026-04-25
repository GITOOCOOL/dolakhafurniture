import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Visit our Samakhusi showroom or reach out to us for furniture inquiries and delivery across Kathmandu.",
};

export default function ContactPage() {
  return (
    <div className="bg-app min-h-screen pt-40 pb-20 font-sans text-heading relative">
      <div className="container mx-auto px-6">
        {/* TOP LEFT: Back to home */}
        <div className="absolute top-16 left-6">
          <Link 
            href="/" 
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
          >
            <span className="text-sm">←</span> Back to home
          </Link>
        </div>
        
        {/* HEADER SECTION - Compact Standard Design */}
        <header className="mb-12 text-left max-w-6xl border-b border-soft pb-6">
          <p className="type-label text-action mb-4">
             Concierge & Support
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-heading">
            Contact / सम्पर्क<span className="text-action">.</span>
          </h1>
        </header>
      </div>
    </div>
  );
}



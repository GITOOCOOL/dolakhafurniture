import { client } from "@/lib/sanity";
import { businessMetaDataQuery } from "@/lib/queries";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const businessMetaData = await client.fetch(businessMetaDataQuery);
  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";
  const tagline = businessMetaData?.tagline || "Our Story";

  return {
    title: `Our Story | ${name}`,
    description: `Learn about ${name}, ${tagline} dedicated to quality craftsmanship.`,
  };
}

export default async function OurStory() {
  const businessMetaData = await client.fetch(businessMetaDataQuery);
  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";

  return (
    <div className="bg-app min-h-screen pt-40 pb-20 font-sans text-heading relative">
      <div className="container mx-auto px-6">
        <div className="absolute top-16 left-6">
          <Link 
            href="/" 
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
          >
            <span className="text-sm">←</span> Back to home
          </Link>
        </div>
        <header className="mb-12 text-left max-w-6xl border-b border-soft pb-6">
          <p className="type-label text-action mb-4">
             Our Heritage & Vision
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-heading leading-tight">
            Our Story / हाम्रो कथा<span className="text-action">.</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="space-y-10 order-2 lg:order-1">
            <h2 className="type-section font-medium text-heading leading-snug">
               Born in Kathmandu, <br />
               Inspired by Tradition.
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-label leading-relaxed font-light">
                Established as a leading furniture designer and supplier in the
                heart of Kathmandu, {name} was founded with a
                singular purpose: to bring the strength and beauty of
                craftsmanship into every Nepali home.
              </p>
              <p className="text-action italic font-serif text-2xl leading-relaxed">
                "{businessMetaData?.tagline || "Quality product with beauty is in our mind."}"
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 aspect-[4/5] border-soft rounded-[4rem] overflow-hidden shadow-sm relative group">
            <img
              src="/hero.jpg"
              alt={`${name} Craftsmanship`}
              className="object-cover w-full h-full opacity-90 sepia-[0.3] hover:sepia-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-action/5 mix-blend-multiply"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-soft border-dotted py-24 mb-40">
          <div className="space-y-4">
            <span className="text-action font-serif italic text-4xl">01.</span>
            <h3 className="text-lg font-serif italic font-semibold text-heading">Smart Design</h3>
            <p className="text-sm text-label leading-relaxed font-light">
              From our famous metallic swings to versatile plant stands, we
              blend iron and wood using smart ideas to maximize your home's
              potential.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-action font-serif italic text-4xl">02.</span>
            <h3 className="text-lg font-serif italic font-semibold text-heading">Enduring Quality</h3>
            <p className="text-sm text-label leading-relaxed font-light">
               Every product—whether a bed, daraz, or console table—is built to
               be as strong as it is good-looking, ensuring it lasts for
               generations.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-action font-serif italic text-4xl">03.</span>
            <h3 className="text-lg font-serif italic font-semibold text-heading">Personal Touch</h3>
            <p className="text-sm text-label leading-relaxed font-light">
              Based in {businessMetaData?.address || "Nepal"}, we pride ourselves on direct
              connection—delivering personally to your doorstep across
              Kathmandu.
            </p>
          </div>
        </div>

        <section className="bg-app text-bone rounded-[5rem] p-12 md:p-24 text-center">
          <h2 className="text-4xl md:text-6xl font-serif italic font-medium mb-10 leading-snug">
             Visit Our Showroom <br /> {businessMetaData?.address || ""}
            <span className="text-warmth">.</span>
          </h2>
          <p className="text-[#e2e8da] mb-12 max-w-xl mx-auto text-xl italic font-serif leading-relaxed">
            "Experience the texture and strength of our pieces in person. We are
            ready to deliver beauty to your home."
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              href="/shop"
              className="bg-app text-app px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-action hover:text-white transition-all"
            >
              Explore Archive
            </Link>
            {businessMetaData?.facebookUrl && (
              <a
                href={businessMetaData.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-bone/20 text-bone px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:border-action hover:text-action transition-all"
              >
                Message Us
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

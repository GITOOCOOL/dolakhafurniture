import React from 'react'
import Link from 'next/link';

type CategoryRibbonProps = { 
  title: string; 
  slug: string;
  subtitle?: string;
  vouchers?: string[];
};

const CategoryRibbon = ({ title, slug, subtitle, vouchers }: CategoryRibbonProps) => {
  const isFeatured = slug === 'featured';
  const isCampaign = slug.startsWith('campaign/');
  
  const buttonText = isFeatured ? 'Shop All' : 'Explore';
  
  // Fix: For campaigns, the slug is already prefixed with 'campaign/', 
  // so we just need to ensure there is a leading slash.
  const buttonHref = isFeatured 
    ? '/shop' 
    : isCampaign 
      ? `/${slug}` 
      : `/category/${slug}`;

  // Format date if subtitle is an Red date
  const formattedSubtitle = subtitle && !isNaN(Date.parse(subtitle))
    ? `Ends on: ${new Date(subtitle).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : subtitle;

  return (
    <div className="relative group w-full md:w-44 flex flex-col justify-between items-start 
                    bg-app border-l-2 border-espresso px-3 py-4
                    shadow-sm transition-all duration-500 
                    hover:bg-white hover:border-action rounded-r-md min-h-[140px]">

      <div className="z-10 w-full overflow-hidden space-y-2">
        <h2 className="text-xl md:text-xl font-serif italic font-medium text-heading leading-tight capitalize">
          {title}
        </h2>
        
        {formattedSubtitle && (
          <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-action">
            {formattedSubtitle}
          </p>
        )}

        {vouchers && vouchers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {vouchers.map((code) => (
              <span 
                key={code}
                className="inline-block px-2 py-0.5 bg-action/10 border border-dashed border-action/40 
                           text-[8px] font-bold text-action rounded-sm uppercase tracking-tighter"
              >
                {code}
              </span>
            ))}
          </div>
        )}
      </div>

      <Link
        href={buttonHref}
        className="z-10 inline-flex items-center gap-1.5 px-3 py-1.5 mt-4 
                   text-[8px] font-bold uppercase tracking-widest
                   rounded-full bg-espresso text-white
                   transition-all duration-300 ease-out
                   hover:bg-action hover:gap-3 hover:pr-4"
      >
        {buttonText}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
};

export default CategoryRibbon;

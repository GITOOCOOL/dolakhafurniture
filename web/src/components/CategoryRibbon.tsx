import React from 'react'
import Link from 'next/link';

type CategoryRibbonProps = { 
  title: string; 
  slug: string;
  subtitle?: string;
  vouchers?: string[];
  description?: string;
};

const CategoryRibbon = ({ title, slug, subtitle, vouchers, description }: CategoryRibbonProps) => {
  const isFeatured = slug === 'featured';
  const isCampaign = slug.startsWith('campaign/');
  
  const buttonText = isFeatured ? 'Shop All' : 'Explore';
  const buttonHref = isFeatured ? '/shop' : isCampaign ? `/${slug}` : `/category/${slug}`;

  const defaultFeaturedDesc = "Our top-rated pieces for every room. We focus on well-built construction and reliable materials to give you comfortable furniture that lasts.";
  const displayDescription = description || (isFeatured ? defaultFeaturedDesc : null);

  const formattedSubtitle = subtitle && !isNaN(Date.parse(subtitle))
    ? `Ends on: ${new Date(subtitle).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : subtitle;

  return (
    <div className="relative group w-full md:w-44 flex flex-col items-start 
                    bg-app border-l-2 border-divider px-4 py-3 md:py-4 lg:py-8 lg:px-6
                    shadow-sm transition-all duration-500 
                    hover:bg-surface hover:border-action rounded-r-md min-h-[80px] lg:h-full">

      <div className="z-10 w-full grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8 items-stretch lg:items-start">
        
        {/* LEFT COLUMN (Mobile) / TOP SECTION (Desktop) */}
        <div className="flex flex-col justify-between h-full lg:h-auto space-y-4">
          <div className="space-y-2">
            <h2 className="type-product text-heading leading-tight capitalize transition-colors group-hover:text-action">
              {title}
            </h2>
            
            {formattedSubtitle && (
              <p className="type-label text-action text-[8px] lg:text-[10px]">
                {formattedSubtitle}
              </p>
            )}

            {vouchers && vouchers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {vouchers.map((code) => (
                  <span 
                    key={code}
                    className="type-label inline-block px-2 py-0.5 bg-surface border border-action/40 
                               text-action rounded-sm tracking-tighter"
                  >
                    {code}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Link
            href={buttonHref}
            className="type-action inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-invert text-app transition-all hover:bg-action w-fit"
          >
            <span className="lg:hidden text-[9px]">{buttonText}</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* RIGHT COLUMN (Mobile) / BOTTOM SECTION (Desktop) */}
        {displayDescription && (
          <div className="flex flex-col justify-center lg:justify-start lg:pt-8 lg:border-t lg:border-soft lg:border-dotted border-l border-soft/30 pl-4 lg:pl-0 lg:border-l-0">
            <p className="type-body text-description leading-relaxed italic text-[11px] lg:text-[13px] line-clamp-3 lg:line-clamp-none">
              {displayDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryRibbon;

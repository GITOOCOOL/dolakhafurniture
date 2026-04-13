import React from 'react'
import Link from 'next/link';

type CategoryRibbonProps = { title: string; slug: string };

const CategoryRibbon = ({ title, slug }: CategoryRibbonProps) => {
  const isFeatured = slug === 'featured';
  const buttonText = isFeatured ? 'Shop All' : 'Explore';
  const buttonHref = isFeatured ? '/shop' : `/category/${slug}`;

  return (
    <div className="relative group w-full md:w-36 flex md:flex-col justify-between items-start 
                    bg-[#fdfaf5] border-l-2 border-[#3d2b1f] px-3 py-4
                    shadow-sm transition-all duration-500 
                    hover:bg-white hover:border-[#a3573a] rounded-r-md">

      <div className="z-10 w-full overflow-hidden">
        <h2 className="text-xl md:text-xl font-serif italic font-medium text-[#3d2b1f] leading-tight capitalize">
          {title}
        </h2>
      </div>

      <Link
        href={buttonHref}
        className="z-10 inline-flex items-center gap-1.5 px-3 py-1.5 mt-3 
                   text-[8px] font-bold uppercase tracking-widest
                   rounded-full bg-[#3d2b1f] text-white
                   transition-all duration-300 ease-out
                   hover:bg-[#a3573a] hover:gap-3 hover:pr-4"
      >
        {buttonText}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
};

export default CategoryRibbon;

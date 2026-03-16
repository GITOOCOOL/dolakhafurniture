import React from 'react'
import Link from 'next/link';

type CategoryRibbonProps = { title: string; slug: string };

const CategoryRibbon = ({ title, slug }: CategoryRibbonProps) => (
  <div className="relative group w-full md:w-56 flex md:flex-col justify-between items-start 
                  bg-[#fdfaf5] border-l-[6px] border-[#3d2b1f] px-6 py-8 
                  shadow-sm transition-all duration-500 
                  hover:bg-white hover:border-[#a3573a] rounded-r-2xl">


    <div className="z-10">
      {/* Badge: Terracotta on mobile, shifts from Espresso to Terracotta on Desktop hover */}
      <span className="inline-block px-3 py-1 mb-3 text-[9px] font-bold tracking-[0.2em] text-white bg-[#a3573a] md:bg-[#3d2b1f] uppercase rounded-full group-hover:bg-[#a3573a] transition-colors">
        Featured
      </span>
      <h2 className="text-3xl font-serif italic font-medium text-[#3d2b1f] leading-[1.1] capitalize break-words">
        {title}
      </h2>
      <p className="text-[10px] text-[#a89f91] mt-4 font-medium uppercase tracking-[0.2em]">
        2024 Collection
      </p>
    </div>

    {/* Link: Permanently Terracotta on mobile (no hover needed), interactive on desktop */}
    <Link
      href={`/category/${slug}`}
      className="z-10 inline-flex items-center text-[11px] font-bold mt-8 p-2 
                   border-2 border-[#a3573a] text-[#a3573a]
                   md:border-[#e5dfd3] md:text-[#3d2b1f]
                   group-hover:border-[#a3573a] group-hover:text-[#a3573a] transition-all"
    >
      BROWSE ALL <span className="text-[#a3573a]">{': ' + title.toUpperCase()}</span>
      <span className="ml-2 transform transition-transform group-hover:translate-x-2">→</span>
    </Link>
  </div>
);

export default CategoryRibbon;

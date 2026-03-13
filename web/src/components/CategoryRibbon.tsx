import React from 'react'
import Link from 'next/link';

type CategoryRibbonProps = { title: string; slug: string };

const CategoryRibbon = ({ title, slug }: CategoryRibbonProps) => (
  <div className="relative group w-full md:w-56 flex md:flex-col justify-between items-start 
                  bg-stone-50 border-l-[6px] border-black px-6 py-8 
                  shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:bg-white hover:border-orange-500">
      
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 p-2 opacity-10 font-black text-4xl select-none">
        {title[0]}
      </div>

      <div className="z-10">
        {/* Badge: Starts Black -> Turns Orange */}
        <span className="inline-block px-2 py-1 mb-3 text-[10px] font-black tracking-[0.2em] text-white bg-black uppercase rounded-sm group-hover:bg-orange-500 transition-colors">
          Featured
        </span>
        <h2 className="text-3xl font-serif font-black text-stone-900 leading-[0.9] uppercase break-words">
          {title}
        </h2>
        <p className="text-[10px] text-stone-400 mt-4 font-bold uppercase tracking-[0.3em]">
          2024 Collection
        </p>
      </div>

      {/* Link: Starts with Black text/Gray border -> Turns Orange */}
      <Link 
        href={`/category/${slug}`} 
        className="z-10 inline-flex items-center text-[11px] font-black mt-8 py-2 
                   border-b-2 border-stone-200 text-stone-900 
                   group-hover:border-orange-500 group-hover:text-orange-500 transition-all"
      >
        BROWSE ALL 
        <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
      </Link>
  </div>
);

export default CategoryRibbon;

import React from 'react'

const Bulletin : React.FC<{ news: string; color?: string }> = ({ news, color }) => {
  // 1. Set your vibrant defaults
  // Vibrant Orange: #ea580c | Vibrant Purple: #7e22ce
  const themeColor = color || '#ea580c'; 

  return (
    <div 
      /* We pass the dynamic hex into a CSS variable once */
      style={{ "--bulletin-color": themeColor } as React.CSSProperties}
      className="inline-flex items-center gap-3 mb-8 px-5 py-2 bg-white rounded-full border border-[var(--bulletin-color)] shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
    >
      <span className="relative flex h-2 w-2">
        {/* The pulse matches your orange or purple perfectly */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--bulletin-color)]"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--bulletin-color)]"></span>
      </span>
      
      {/* Font Correction: font-sans for high-visibility news data */}
      <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] text-[var(--bulletin-color)]">
        {news}
      </span>
    </div>
  )
}

export default Bulletin

import Link from 'next/link';

export default function Bulletin({ title, content, slug, color }: { title: string; content: string; slug: string; color?: string }) {

  return (
    <Link
      href={`/bulletin/${slug}`}
      style={{ "--bulletin-color": color || "#ea580c" } as React.CSSProperties}
      className="inline-flex items-center gap-4 px-6 py-1 bg-white rounded-[2rem] border-1 border-[var(--bulletin-color)] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300 group w-[85%] md:max-w-xl flex-shrink-0 justify-between isolate"
    >
      <div className="flex flex-col min-w-0 flex-1">
        {/* Line 1: Bold Title */}
        <span className="text-[12px] font-serif italic font-bold text-[var(--bulletin-color)] leading-none mb-1 truncate">
          {title.slice(0, 40)}
        </span>

        {/* Line 2 & 3: Content */}
        <span className="text-[8px] md:text-[10px] font-sans font-bold tracking-tight text-[var(--bulletin-color)] line-clamp-2 leading-[1.2] min-h-[1.5rem] md:min-h-[2.2rem]">
          {content.slice(0, 40) + "..."}
        </span>
      </div>

      <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--bulletin-color)] border-[var(--bulletin-color)] border-[1px] rounded-full px-3 py-1  flex-shrink-0 ml-4 group-hover:bg-[var(--bulletin-color)] group-hover:text-white transition-all shadow-md active:scale-95">
        more...
      </span>
    </Link>
  );
}
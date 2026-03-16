import Link from 'next/link';

export default function Bulletin({ title, content, slug, color }: { title: string; content: string; slug: string; color?: string }) {
  const words = content.split(' ');
  const truncatedContent = words.length > 8 ? words.slice(0, 8).join(' ') + '...' : content;

  return (
    <Link
      href={`/bulletin/${slug}`}
      style={{ "--bulletin-color": color || "#ea580c" } as React.CSSProperties}
      className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-full border border-[var(--bulletin-color)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:scale-105 transition-transform duration-300 group"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--bulletin-color)]"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--bulletin-color)]"></span>
      </span>
      <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] text-[var(--bulletin-color)]">
        <span className="font-serif italic mr-2">{title}:</span>
        {truncatedContent}
      </span>
    </Link>
  );
}
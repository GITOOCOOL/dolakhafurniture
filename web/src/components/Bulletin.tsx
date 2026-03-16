export default function Bulletin({ news, color }: { news: string; color?: string }) {
  return (
    <div
      style={{ "--bulletin-color": color || "#ea580c" } as React.CSSProperties}
      className="inline-flex items-center gap-3 mb-8 px-5 py-2 bg-white rounded-full border border-[var(--bulletin-color)] shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--bulletin-color)]"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--bulletin-color)]"></span>
      </span>
      <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] text-[var(--bulletin-color)]">
        {news}
      </span>
    </div>
  );
}
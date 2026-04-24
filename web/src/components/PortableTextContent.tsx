import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { Info, Lightbulb, AlertTriangle } from 'lucide-react';

interface PortableTextContentProps {
  value: any;
}

/**
 * Universal Portable Text Renderer
 * Translates Raw JSON from Sanity into Professional Web Blocks.
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <div className="relative w-full aspect-video my-8 rounded-lg overflow-hidden border border-border">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Blog Image'}
            fill
            className="object-cover"
          />
        </div>
      );
    },
    table: ({ value }) => {
      const { rows } = value;
      return (
        <div className="my-8 overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50">
                {rows[0].cells.map((cell: string, i: number) => (
                  <th key={i} className="p-4 font-bold border-b border-border">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  {row.cells.map((cell: string, j: number) => (
                    <td key={j} className="p-4 border-b border-border text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    callout: ({ value }) => {
      const { type, text } = value;
      const config: any = {
        'variant-a': { icon: <Lightbulb className="w-5 h-5 text-[#D4AF37]" />, bg: 'bg-[#D4AF37]/5', border: 'border-[#D4AF37]/20', label: 'INSIGHT' },
        'variant-b': { icon: <Info className="w-5 h-5 text-primary" />, bg: 'bg-primary/5', border: 'border-primary/20', label: 'HERITAGE' },
        'variant-c': { icon: <AlertTriangle className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-500/5', border: 'border-orange-500/20', label: 'NOTE' },
      };

      const style = config[type] || config['variant-a'];

      return (
        <div className={`my-8 p-6 rounded-xl border ${style.bg} ${style.border} flex gap-4 items-start`}>
          <div className="mt-1">{style.icon}</div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase block mb-1">{style.label}</span>
            <p className="text-sm leading-relaxed italic">{text}</p>
          </div>
        </div>
      );
    },
    youtube: ({ value }) => {
      const { url } = value;
      // Basic extraction of YouTube ID
      const vid = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return (
        <div className="my-8 relative w-full aspect-video rounded-xl overflow-hidden border border-border shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${vid}`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-serif mt-12 mb-6 text-foreground">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-serif mt-10 mb-5 text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-serif mt-8 mb-4 text-foreground">{children}</h3>,
    normal: ({ children }) => <p className="text-muted-foreground leading-loose mb-6 text-lg">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-8 py-2 my-10 italic text-2xl font-serif text-foreground/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-8 text-muted-foreground space-y-3">{children}</ul>,
  },
  marks: {
    link: ({ children, value }) => {
      return (
        <a href={value.href} className="text-primary underline hover:text-primary/80 transition-colors">
          {children}
        </a>
      );
    },
  },
};

export const PortableTextContent: React.FC<PortableTextContentProps> = ({ value }) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <PortableText value={value} components={components} />
    </div>
  );
};

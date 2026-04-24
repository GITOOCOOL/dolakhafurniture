import { client } from '@/lib/sanity';
import { adminLogsQuery } from '@/lib/queries';
import { Calendar, BookOpen, Activity, AlertCircle, Shield, PenTool, Database } from 'lucide-react';
import Link from 'next/link';

// --- HERITAGE ADAPTIVE COMPONENTS ---
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-app border border-soft rounded-none shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = "" }: any) => (
  <span className={`px-4 py-1.5 rounded-none text-[10px] font-sans font-bold uppercase tracking-[0.1em] border border-soft ${className}`}>
    {children}
  </span>
);

async function getLogs(nature?: string) {
  // --- SURGICAL LIVE QUERY (NO CACHE/NO CDN) ---
  const query = nature 
    ? `*[_type == "adminLog" && nature == $nature] | order(timestamp desc) { _id, title, timestamp, type, nature, status, content, metadata }`
    : adminLogsQuery;
  
  return await client.fetch(query, { nature: nature || null }, { 
    cache: 'no-store',
    next: { revalidate: 0 } 
  });
}

// --- NEXT.JS 15 COMPLIANT SERVER PAGE ---
export default async function AdminLogsPage(props: { searchParams: Promise<{ nature?: string }> }) {
  // UNWRAP DYNAMIC API PROMISE (NEXT 15 REQUIREMENT)
  const searchParams = await props.searchParams;
  const activeNature = searchParams?.nature;
  
  const logs = await getLogs(activeNature);

  const filters = [
    { label: "All Intelligence", value: null, icon: Database },
    { label: "Implementation", value: "implementation", icon: Activity },
    { label: "Documentation", value: "documentation", icon: BookOpen },
    { label: "Security", value: "security", icon: Shield },
    { label: "Design", value: "design", icon: PenTool },
  ];

  const getTypeIcon = (nature: string) => {
    switch (nature?.toLowerCase()) {
      case 'documentation': return <BookOpen className="w-4 h-4" />;
      case 'implementation': return <Activity className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'design': return <PenTool className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusTone = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'info': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-soft text-label border-divider';
    }
  };

  return (
    <div className="space-y-12 pb-24 bg-app min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-8 border-l-4 border-action pl-8">
        <h1 className="text-4xl font-bold tracking-tight text-heading font-serif italic uppercase">
          🛰️ Admin Brain <span className="text-action font-sans not-italic">&</span> Insights
        </h1>
        
        {/* FILTER BAR - HERITAGE ALIGNED */}
        <div className="flex flex-wrap gap-3">
          {filters.map((f) => {
            const isActive = activeNature === f.value || (!activeNature && !f.value);
            return (
              <Link
                key={f.label}
                href={f.value ? `/admin/logs?nature=${f.value}` : '/admin/logs'}
                className={`flex items-center gap-3 px-8 py-4 border transition-all text-[11px] font-sans font-bold uppercase tracking-[0.15em] ${
                  isActive
                    ? "bg-action text-white border-action shadow-md"
                    : "bg-app text-label border-soft hover:border-action/50 hover:text-heading"
                }`}
              >
                <f.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-action"}`} />
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* LOG FEED */}
      <div className="grid gap-10">
        {logs.map((log: any) => (
          <Card key={log._id}>
            <div className="p-10">
              <div className="flex flex-wrap items-center justify-between gap-8 mb-8 border-b border-soft border-dotted pb-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-soft border border-soft text-heading shadow-inner">
                    {getTypeIcon(log.nature)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-heading tracking-tight font-serif uppercase leading-tight">{log.title}</h2>
                    <div className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-label mt-4 italic">
                      <Calendar className="w-3.5 h-3.5 text-action opacity-60" />
                      {new Date(log.timestamp).toLocaleString('en-AU', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-soft text-heading border-action/30">{log.nature || 'General'}</Badge>
                   <Badge className={getStatusTone(log.status)}>
                     {log.status || 'Verified'}
                   </Badge>
                </div>
              </div>

              <div className="whitespace-pre-wrap text-[16px] leading-relaxed text-heading font-sans bg-soft p-10 border-l-2 border-action/20 italic">
                {log.content}
              </div>

              {log.metadata && (
                 <div className="mt-8 pt-8 border-t border-soft border-dotted flex flex-wrap gap-8 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-label/70">
                    <div className="flex items-center gap-2 bg-soft px-3 py-1.5 border border-soft">
                        <span className="text-action">TARGET_ORBIT:</span> {log.metadata.targetId || 'GLOBAL'}
                    </div>
                    <div className="flex items-center gap-2 bg-soft px-3 py-1.5 border border-soft">
                        <span className="text-action">PULSE_CODE:</span> {log.metadata.action || 'V41_HARDENED'}
                    </div>
                 </div>
              )}
            </div>
          </Card>
        ))}

        {logs.length === 0 && (
          <div className="p-24 text-center border-2 border-dotted border-soft bg-soft">
            <p className="text-label font-sans font-bold uppercase tracking-[0.2em] text-sm italic">No data streams matching current orbit filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

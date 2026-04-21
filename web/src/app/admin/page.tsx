import React from "react";
import { 
  TrendingUp, 
  Package, 
  Clock, 
  Users 
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* WELCOME SECTION */}
      <section>
        <h1 className="type-hero font-medium text-heading mb-4">
          Overview<span className="text-action">.</span>
        </h1>
        <p className="font-serif italic text-xl text-label">
          "The strength of the brand lies in the precision of its management."
        </p>
      </section>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Orders" 
          value="128" 
          change="+12% this month" 
          icon={Package} 
        />
        <StatCard 
          title="Inquiries" 
          value="42" 
          change="Pending: 12" 
          icon={Clock} 
        />
        <StatCard 
          title="Active Users" 
          value="1.2k" 
          change="+24% vs last year" 
          icon={Users} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.4%" 
          change="+0.2% vs last week" 
          icon={TrendingUp} 
        />
      </div>

      {/* RECENT ACTIVITY TABS (Placeholders for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="bg-app p-10 rounded-[3rem] border border-soft shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-soft border-dotted pb-6">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-heading">
              Recent Orders
            </h3>
            <button className="text-[9px] font-bold uppercase tracking-widest text-action hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-6 text-center py-12">
            <p className="text-label italic font-serif">Integration with Sanity Orders coming next...</p>
          </div>
        </section>

        <section className="bg-app p-10 rounded-[3rem] border border-soft shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-soft border-dotted pb-6">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-heading">
              Recent Inquiries
            </h3>
            <button className="text-[9px] font-bold uppercase tracking-widest text-action hover:underline">
              View All
            </button>
          </div>
           <div className="space-y-6 text-center py-12">
            <p className="text-label italic font-serif">Integration with Sanity Inquiries coming next...</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any 
}) {
  return (
    <div className="bg-app p-10 rounded-[3rem] border border-soft shadow-sm hover:border-action/20 transition-all duration-700 group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-soft rounded-2xl group-hover:bg-action group-hover:text-white transition-all duration-500">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="text-[9px] font-sans font-bold text-action bg-action/5 px-4 py-1.5 rounded-full uppercase tracking-widest">
          {change}
        </span>
      </div>
      <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-label mb-2">
        {title}
      </p>
      <h4 className="text-4xl font-sans font-bold text-heading tracking-tighter">
        {value}
      </h4>
    </div>
  );
}

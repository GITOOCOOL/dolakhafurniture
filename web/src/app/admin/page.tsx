import React from "react";
import { 
  TrendingUp, 
  Package, 
  Clock, 
  Users,
  Box,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { createClient } from "@/utils/supabase/server";
import Input from "@/components/ui/Input";
import DownloadButton from "@/components/DownloadButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch real-time metrics
  const [
    ordersCount,
    inquiriesCount,
    pendingInquiriesCount,
    recentOrders,
    recentInquiries,
    activeProductsCount,
    lowStockCount,
    revenueSum,
    pendingOrdersCount,
  ] = await Promise.all([
    client.fetch(`count(*[_type == "order"])`, {}, { useCdn: false }),
    client.fetch(`count(*[_type == "inquiry"])`, {}, { useCdn: false }),
    client.fetch(`count(*[_type == "inquiry" && status == "new"])`, {}, { useCdn: false }),
    client.fetch(`*[_type == "order"] | order(_createdAt desc)[0...5] {
      _id, orderNumber, customerName, totalPrice, status
    }`, {}, { useCdn: false }),
    client.fetch(`*[_type == "inquiry"] | order(_createdAt desc)[0...5] {
      _id, customerName, subject, status, _createdAt
    }`, {}, { useCdn: false }),
    client.fetch(`count(*[_type == "product" && isActive == true])`, {}, { useCdn: false }),
    client.fetch(`count(*[_type == "product" && isActive == true && stock < 3])`, {}, { useCdn: false }),
    client.fetch(`math::sum(*[_type == "order"].totalPrice)`, {}, { useCdn: false }),
    client.fetch(`count(*[_type == "order" && status in ["pending", "processing"]])`, {}, { useCdn: false }),
  ]);

  const totalRevenue = Math.round(revenueSum || 0);
  const activeOrdersCount = pendingOrdersCount || 0;

  const supabase = await createClient();
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* QUICK ACTIONS & ASSETS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-app p-8 rounded-[3rem] border border-soft border-dotted">
        <div>
           <h2 className="type-label text-label mb-2">Administrative Center</h2>
           <h3 className="text-3xl font-serif italic text-heading">Control Dashboard & Assets</h3>
        </div>
        <div className="flex flex-wrap gap-4">
           <Link href="/shop" target="_blank" className="px-6 py-3 bg-surface border border-soft rounded-full type-action hover:bg-app text-heading">
             View Live Shop
           </Link>
           <DownloadButton label="Generate Public Price List" variant="outline" className="!bg-heading !text-white !border-heading hover:!bg-action transition-all" />
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Revenue" 
          value={`Rs. ${totalRevenue.toLocaleString()}`} 
          change="Lifetime Gross" 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Active Orders" 
          value={activeOrdersCount.toString()} 
          change={`${ordersCount} Total`} 
          icon={Package} 
        />
        <StatCard 
          title="Inventory Alert" 
          value={`${lowStockCount} Items`} 
          change={lowStockCount > 0 ? "Needs Attention" : "All Healthy"} 
          icon={AlertTriangle} 
          alert={lowStockCount > 0}
        />
        <StatCard 
          title="New Inquiries" 
          value={pendingInquiriesCount.toString()} 
          change={`${inquiriesCount} Total`} 
          icon={Clock} 
        />
        <StatCard 
          title="Active Users" 
          value={usersCount?.toString() || "0"} 
          change="Registered" 
          icon={Users} 
        />
      </div>

      {/* RECENT ACTIVITY TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="bg-app p-10 rounded-[3rem] border border-soft shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-soft border-dotted pb-6">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-heading">
              Recent Orders
            </h3>
            <Link href="/admin/orders" className="text-[9px] font-bold uppercase tracking-widest text-action hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders && recentOrders.length > 0 ? recentOrders.map((order: any) => (
              <Link key={order._id} href="/admin/orders" className="flex items-center justify-between p-4 bg-soft/30 rounded-2xl hover:bg-soft transition-colors group">
                <div>
                  <p className="text-sm font-bold text-heading">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-label">{order.customerName || "Guest User"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-heading">Rs. {order.totalPrice || 0}</p>
                  <p className="text-[9px] uppercase tracking-widest text-action font-bold mt-1">{order.status || "pending"}</p>
                </div>
              </Link>
            )) : (
              <p className="text-center text-label italic font-serif py-8">No recent orders found.</p>
            )}
          </div>
        </section>

        <section className="bg-app p-10 rounded-[3rem] border border-soft shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-soft border-dotted pb-6">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-heading">
              Recent Inquiries
            </h3>
            <Link href="/admin/inquiries" className="text-[9px] font-bold uppercase tracking-widest text-action hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {recentInquiries && recentInquiries.length > 0 ? recentInquiries.map((inquiry: any) => (
              <Link key={inquiry._id} href="/admin/inquiries" className="flex items-center justify-between p-4 bg-soft/30 rounded-2xl hover:bg-soft transition-colors group">
                <div>
                  <p className="text-sm font-bold text-heading">{inquiry.customerName || "Anonymous"}</p>
                  <p className="text-xs text-label truncate max-w-[200px]">{inquiry.subject || "General Inquiry"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-action font-bold mt-1">{inquiry.status || "new"}</p>
                </div>
              </Link>
            )) : (
              <p className="text-center text-label italic font-serif py-8">No pending inquiries.</p>
            )}
          </div>
          
          {/* META INTEGRATION PREVIEW */}
          <div className="mt-8 pt-6 border-t border-soft border-dotted">
             <div className="flex justify-between items-center bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <TrendingUp size={16} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-heading">Meta Conversions</p>
                     <p className="text-[9px] uppercase tracking-widest text-label font-bold mt-1">Status: Pending API Keys</p>
                   </div>
                </div>
                <Link href="#" className="px-4 py-2 bg-white rounded-full text-[9px] font-bold uppercase tracking-widest text-blue-600 border border-blue-100 hover:border-blue-300 transition-colors shadow-sm">
                  Setup
                </Link>
             </div>
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
  icon: Icon,
  alert = false
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any;
  alert?: boolean;
}) {
  return (
    <div className={`bg-app p-10 rounded-[3rem] border shadow-sm transition-all duration-700 group ${alert ? 'border-red-500/30' : 'border-soft hover:border-action/20'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl transition-all duration-500 ${alert ? 'bg-red-500/10 text-red-500' : 'bg-soft group-hover:bg-action group-hover:text-white'}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className={`text-[9px] font-sans font-bold px-4 py-1.5 rounded-full uppercase tracking-widest ${alert ? 'bg-red-500/10 text-red-600' : 'text-action bg-action/5'}`}>
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

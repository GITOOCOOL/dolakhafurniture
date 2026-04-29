"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  Clock, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  Layout,
  Search,
  Filter,
  Video,
  FileText,
  ExternalLink,
  ChevronUp,
  Target,
  Box,
  Image as ImageIcon,
  BookOpen,
  Flag,
  ShoppingCart
} from "lucide-react";

interface ContentIdea {
  _id: string;
  title: string;
  contentType: string;
  description: string;
  platform: string[];
  priority: string;
  status: string;
  mediaType: string;
  imageUrl?: string;
  videoUrl?: string;
  script?: string;
  inspirations?: string[];
  linkedProducts?: { title: string; slug: string }[];
  notes?: string;
  createdAt: string;
}

interface Props {
  initialIdeas: ContentIdea[];
}

const statusConfig: any = {
  backlog: { label: "Backlog", color: "bg-description/10 text-description", icon: Clock },
  researching: { label: "Researching", color: "bg-action/10 text-action", icon: Search },
  ready: { label: "Ready to Shoot", color: "bg-blue-500/10 text-blue-500", icon: Layout },
  editing: { label: "Editing", color: "bg-orange-500/10 text-orange-500", icon: Filter },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
};

const priorityConfig: any = {
  high: { label: "High", color: "text-red-500" },
  medium: { label: "Medium", color: "text-orange-500" },
  low: { label: "Low", color: "text-blue-500" },
};

const formatConfig: any = {
  story: { label: "Story", icon: Clock, color: "text-pink-500", bg: "bg-pink-50" },
  reel: { label: "Reel", icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  post: { label: "Static Post", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50" },
  blog: { label: "Blog Post", icon: BookOpen, color: "text-green-500", bg: "bg-green-50" },
  campaign: { label: "Campaign Media", icon: Flag, color: "text-red-500", bg: "bg-red-50" },
  product_content: { label: "Product Content", icon: ShoppingCart, color: "text-orange-500", bg: "bg-orange-50" },
};

export default function AdminContentIdeasClient({ initialIdeas }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredIdeas = initialIdeas.filter((idea) => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.script?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || idea.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-soft pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-action/10 rounded-2xl">
            <Lightbulb size={24} className="text-action" />
          </div>
          <div>
            <h1 className="text-3xl font-serif italic text-heading">Content Ideas</h1>
            <p className="text-sm font-sans text-description mt-1">
              Organize and plan your social media and marketing ideas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-label group-focus-within:text-action transition-colors" />
            <input 
              type="text"
              placeholder="Search ideas..."
              className="bg-white border border-soft rounded-full pl-12 pr-6 py-3 text-xs font-sans focus:outline-none focus:border-action transition-all w-[240px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="bg-white border border-soft rounded-full px-6 py-3 text-xs font-sans font-bold uppercase tracking-widest focus:outline-none focus:border-action cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            {Object.keys(statusConfig).map((key) => (
              <option key={key} value={key}>{statusConfig[key].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredIdeas.map((idea) => {
          const isExpanded = expandedId === idea._id;
          const StatusIcon = statusConfig[idea.status]?.icon || Clock;
          const FormatIcon = formatConfig[idea.contentType]?.icon || Tag;
          
          return (
            <motion.div 
              layout
              key={idea._id}
              onClick={() => toggleExpand(idea._id)}
              className={`bg-white rounded-[2rem] overflow-hidden border border-soft shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer h-fit ${
                isExpanded ? "lg:col-span-2 lg:row-span-2 shadow-2xl border-action/30" : "hover:-translate-y-1"
              }`}
            >
              {/* Moodboard */}
              <div className="relative">
                {idea.mediaType === "video" && idea.videoUrl ? (
                  <div className={`relative w-full overflow-hidden bg-black transition-all duration-500 ${isExpanded ? "h-64 md:h-[30rem]" : "h-48"}`}>
                    <video 
                      src={idea.videoUrl} 
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay={isExpanded}
                      onMouseOver={(e) => !isExpanded && (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => !isExpanded && (e.target as HTMLVideoElement).pause()}
                    />
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full">
                      <Video size={14} className="text-white" />
                    </div>
                  </div>
                ) : idea.imageUrl ? (
                  <div className={`relative w-full overflow-hidden transition-all duration-500 ${isExpanded ? "h-64 md:h-[30rem]" : "h-48"}`}>
                    <img 
                      src={idea.imageUrl} 
                      alt={idea.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ) : (
                  <div className={`w-full bg-soft flex items-center justify-center transition-all duration-500 ${isExpanded ? "h-64 md:h-[30rem]" : "h-48"}`}>
                    <Lightbulb size={32} className="text-label/30" />
                  </div>
                )}
                
                {!isExpanded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-heading shadow-xl">
                      View Details
                    </span>
                  </div>
                )}

                {/* Format Overlay Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/20 shadow-lg ${formatConfig[idea.contentType]?.bg || "bg-white/80"}`}>
                   <FormatIcon size={12} className={formatConfig[idea.contentType]?.color} />
                   <span className={`text-[9px] font-sans font-bold uppercase tracking-widest ${formatConfig[idea.contentType]?.color}`}>
                     {formatConfig[idea.contentType]?.label}
                   </span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-2 ${statusConfig[idea.status]?.color}`}>
                    <StatusIcon size={12} />
                    {statusConfig[idea.status]?.label}
                  </div>
                  <div className="flex items-center gap-2 text-label">
                    <Clock size={12} />
                    <span className="text-[10px] font-sans font-bold">
                      {format(new Date(idea.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className={`font-serif text-heading transition-all ${isExpanded ? "text-4xl italic" : "text-xl group-hover:text-action"}`}>
                    {idea.title}
                  </h3>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-8 pt-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Concept & Script Column */}
                        <div className="space-y-8">
                           {idea.description && (
                             <div className="space-y-3">
                               <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-label flex items-center gap-2">
                                 <Filter size={12} />
                                 The Idea
                               </div>
                               <p className="text-sm font-sans text-description leading-relaxed">
                                 {idea.description}
                               </p>
                             </div>
                           )}

                           {idea.script && (
                             <div className="bg-soft/50 rounded-3xl p-8 space-y-4 border border-soft/50">
                               <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-label">
                                 <FileText size={12} />
                                 Voiceover Copy / Script
                               </div>
                               <p className="text-xl font-sans text-heading italic leading-relaxed">
                                 "{idea.script}"
                               </p>
                             </div>
                           )}
                        </div>

                        {/* References & Links Column */}
                        <div className="space-y-8">
                           {idea.inspirations && idea.inspirations.length > 0 && (
                             <div className="space-y-4">
                               <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-label">
                                 <ExternalLink size={12} />
                                 Inspiration References
                               </div>
                               <div className="flex flex-wrap gap-3">
                                 {idea.inspirations.map((url, idx) => (
                                   <a 
                                     key={idx} 
                                     href={url} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     onClick={(e) => e.stopPropagation()}
                                     className="px-6 py-3 bg-white border border-soft rounded-full text-xs font-sans font-bold text-action hover:bg-action hover:text-white transition-all shadow-md flex items-center gap-3"
                                   >
                                     Asset Ref #{idx + 1}
                                     <ExternalLink size={12} />
                                   </a>
                                 ))}
                               </div>
                             </div>
                           )}

                           {idea.linkedProducts && idea.linkedProducts.length > 0 && (
                             <div className="space-y-4">
                               <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-label">
                                 <ShoppingCart size={12} />
                                 Shop the Look / Tagged Products
                               </div>
                               <div className="flex flex-wrap gap-3">
                                 {idea.linkedProducts.map((prod) => (
                                   <div 
                                     key={prod.slug}
                                     className="px-6 py-3 bg-action text-white rounded-full text-xs font-sans font-bold shadow-md flex items-center gap-3"
                                   >
                                     {prod.title}
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {idea.platform && idea.platform.length > 0 && (
                               <div className="space-y-3">
                                 <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-label flex items-center gap-2">
                                   <Target size={12} />
                                   Target Channels
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                   {idea.platform.map((p) => (
                                     <span key={p} className="px-4 py-2 bg-action/5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-action border border-action/10">
                                       {p.replace("_", " ")}
                                     </span>
                                   ))}
                                 </div>
                               </div>
                             )}

                             <div className="space-y-3">
                                <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-label flex items-center gap-2">
                                  <AlertCircle size={12} />
                                  Strategic Priority
                                </div>
                                <div className={`px-4 py-2 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest inline-block ${priorityConfig[idea.priority]?.color} bg-soft/50`}>
                                   {priorityConfig[idea.priority]?.label} Priority
                                </div>
                             </div>
                           </div>
                        </div>
                      </div>

                      {idea.notes && (
                         <div className="p-8 bg-orange-50/50 rounded-3xl border border-orange-100 space-y-3">
                            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600">Production Strategery & Notes</div>
                            <p className="text-sm text-orange-800/80 font-sans leading-relaxed">{idea.notes}</p>
                         </div>
                      )}
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(null);
                        }}
                        className="w-full py-4 rounded-2xl bg-soft text-label text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-action hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <ChevronUp size={14} />
                        Close Details
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed Footer */}
                {!isExpanded && (
                  <div className="pt-6 border-t border-soft flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <AlertCircle size={12} className={priorityConfig[idea.priority]?.color} />
                        <span className={`text-[10px] font-sans font-bold uppercase tracking-widest ${priorityConfig[idea.priority]?.color}`}>
                          {priorityConfig[idea.priority]?.label} Priority
                        </span>
                     </div>
                     <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-action">
                        View Details →
                     </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-soft rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb size={32} className="text-label" />
          </div>
          <h2 className="text-2xl font-serif text-heading italic">No matching concepts found</h2>
          <p className="text-description font-sans mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

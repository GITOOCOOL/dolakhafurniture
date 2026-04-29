"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  storeManual: string;
  adminManual: string;
  engineManual: string;
}

export default function DocumentationTabs({ storeManual, adminManual, engineManual }: Props) {
  const [activeTab, setActiveTab] = useState<"store" | "admin" | "engine">("store");

  const getContent = () => {
    switch (activeTab) {
      case "store": return storeManual;
      case "admin": return adminManual;
      case "engine": return engineManual;
      default: return storeManual;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 mb-8 pb-4 border-b border-soft">
        <button
          onClick={() => setActiveTab("store")}
          className={`px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all ${
            activeTab === "store"
              ? "bg-action text-white shadow-md"
              : "text-label hover:bg-soft"
          }`}
        >
          Store Manual
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all ${
            activeTab === "admin"
              ? "bg-action text-white shadow-md"
              : "text-label hover:bg-soft"
          }`}
        >
          Admin Manual
        </button>
        <button
          onClick={() => setActiveTab("engine")}
          className={`px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all ${
            activeTab === "engine"
              ? "bg-action text-white shadow-md"
              : "text-label hover:bg-soft"
          }`}
        >
          Content Engine
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-soft/50 prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-h1:text-4xl prose-h2:text-2xl prose-a:text-action hover:prose-a:text-action/80 prose-li:marker:text-action">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {getContent()}
        </ReactMarkdown>
      </div>
    </div>
  );
}

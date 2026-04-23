"use client";

import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Leaf } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-soft border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-heading selection:bg-action/10 flex flex-col">
      {/* Navigation */}
      <div className="p-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-label hover:text-heading transition-colors"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Main Card */}
          <div className="bg-white border border-soft rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(61,43,31,0.08)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-action [60px] opacity-10" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-[2rem] bg-app border border-soft flex items-center justify-center text-heading mb-8 shadow-sm">
                <Leaf size={28} strokeWidth={1.5} />
              </div>

              {/* REUSABLE AUTH FORM */}
              <AuthForm onSuccess={() => router.push("/")} />

              <div className="mt-10 pt-8 border-t border-soft flex items-center justify-center gap-6 opacity-30 w-full">
                 <ShieldCheck size={20} />
                 <span className="text-[9px] font-bold uppercase tracking-widest">Secure Login</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Decoration */}
      <div className="p-12 flex justify-center opacity-10 mt-auto">
         <Leaf size={40} />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Leaf, Send } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Reset link sent! Please check your email inbox." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-app border border-soft rounded-[3rem] p-10 shadow-sm text-center"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-label hover:text-action transition-all mb-10 group">
           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
           Back to Store
        </Link>

        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 mb-8 flex items-center justify-center">
           <Mail size={20} />
        </div>

        <h1 className="text-3xl font-serif italic text-heading mb-3">Forgot Password?</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label mb-10">We'll send you a secure recovery link</p>

        <form onSubmit={handleReset} className="space-y-6 text-left">
          <Input 
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message && (
            <p className={`text-[10px] font-bold px-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {message.text}
            </p>
          )}

          <Button 
            type="submit"
            fullWidth
            size="lg"
            isLoading={loading}
            leftIcon={<Send size={18} />}
          >
            Send Reset Link
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-soft border-dotted flex justify-center">
           <div className="flex items-center gap-2 text-label opacity-40">
              <Leaf size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest font-sans">Dolakha Security Protocol</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

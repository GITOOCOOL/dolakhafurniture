"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, ArrowRight, Leaf, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 1. Wait for Supabase to establish the recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("[Auth-Debug] Recovery session established for:", session.user.email);
        setIsReady(true);
      } else {
        console.warn("[Auth-Debug] No active recovery session found.");
        // We give it a second to settle in case of race conditions
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession) setIsReady(true);
        }, 1500);
      }
    };
    checkSession();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isReady) {
      setMessage({ type: 'error', text: "Session still initializing. Please wait a moment." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);
    console.log("[Auth-Debug] Attempting to update password...");

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("[Auth-Debug] Password update failed:", error);
        setMessage({ type: 'error', text: error.message });
      } else {
        console.log("[Auth-Debug] Password update successful:", data);
        setMessage({ type: 'success', text: "Password updated successfully. You can now log in." });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (err: any) {
      console.error("[Auth-Debug] Unexpected error:", err);
      setMessage({ type: 'error', text: "An unexpected error occurred. Please refresh the page." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-app border border-soft rounded-[3rem] p-10 shadow-sm text-center"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-action/10 flex items-center justify-center text-action mb-8">
           {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
        </div>

        <h1 className="text-3xl font-serif italic text-heading mb-3">Secure Recovery</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label mb-10">Set your new access credentials</p>

        {!isReady && (
          <div className="mb-8 p-4 bg-soft/30 rounded-2xl animate-pulse">
             <p className="text-[9px] font-bold uppercase tracking-widest text-label">Initializing secure session...</p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6 text-left">
          <Input 
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!isReady}
          />
          <Input 
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={!isReady}
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
            disabled={!isReady}
            leftIcon={<ShieldCheck size={18} />}
          >
            Update Password
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

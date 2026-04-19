"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, User, Ticket, ArrowLeft, ShieldCheck, Mail, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { trackEvent } from "./MetaPixel";

interface AuthFormProps {
  onSuccess?: () => void;
  showRewardBanner?: boolean;
}

export default function AuthForm({ onSuccess, showRewardBanner = true }: AuthFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'social' | 'email'>('social');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleLogin = () => {
    trackEvent("Contact", { method: "social_login_google", goal: "signup_intent" });
    const redirectTo = `${window.location.origin}/auth/callback?next=/account`;
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  };

  const handleFacebookLogin = () => {
    trackEvent("Contact", { method: "social_login_facebook", goal: "signup_intent" });
    const redirectTo = `${window.location.origin}/auth/callback?next=/account`;
    supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo,
      },
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (onSuccess) onSuccess();
        router.push("/account");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        trackEvent("CompleteRegistration");
        setError("Success! Please check your email for the confirmation link.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative z-10 w-full">
      <h1 className="text-3xl font-serif italic mb-4 text-center">
        {isLogin ? "Join our community." : "Create an account."}
      </h1>

      {showRewardBanner && (
        <div className="bg-[#fdfaf5] border border-[#e5dfd3] rounded-2xl p-4 mb-8 flex items-center gap-3 text-left">
          <Ticket className="text-[#a3573a]" size={20} />
          <p className="text-[11px] font-medium text-[#3d2b1f]">Use code <span className="font-bold">WELCOME10</span> for 10% OFF after signup.</p>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex bg-[#fdfaf5] p-1 rounded-full border border-[#e5dfd3] mb-8">
        <Button
          variant={authMethod === 'social' ? 'primary' : 'ghost'}
          size="sm"
          fullWidth
          onClick={() => setAuthMethod('social')}
          className={authMethod === 'social' ? "" : "text-[#a89f91]"}
        >
          Social
        </Button>
        <Button
          variant={authMethod === 'email' ? 'primary' : 'ghost'}
          size="sm"
          fullWidth
          onClick={() => setAuthMethod('email')}
          className={authMethod === 'email' ? "" : "text-[#a89f91]"}
        >
          Email
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {authMethod === 'social' ? (
          <motion.div
            key="social"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleGoogleLogin}
              leftIcon={<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>}
            >
              Continue with Google
            </Button>

            <Button
              size="lg"
              fullWidth
              onClick={handleFacebookLogin}
              className="bg-[#1877F2] hover:bg-[#166fe5]"
              leftIcon={<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
            >
              Continue with Facebook
            </Button>

            <p className="text-[10px] text-[#a89f91] mt-6 leading-relaxed text-center">
              Safe & secure login via your preferred social platform.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
              {!isLogin && (
                <Input
                  label="Full Name"
                  placeholder="Suraj Thakuri"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <p className={`text-[10px] font-bold px-4 ${error.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>
                  {error}
                </p>
              )}

              <Button
                type="submit"
                isLoading={isProcessing}
                fullWidth
                size="lg"
                leftIcon={isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
              >
                {isLogin ? "Sign In" : "Register Now"}
              </Button>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#a3573a] hover:underline"
                >
                  {isLogin ? "Need an account? Signup" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

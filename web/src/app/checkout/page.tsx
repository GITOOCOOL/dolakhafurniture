"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home and trigger the checkout drawer via query param
    router.replace("/?checkout=true");
  }, [router]);

  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-espresso rounded-full flex items-center justify-center text-bone mb-8 animate-pulse shadow-xl">
        <Leaf size={32} strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-serif italic text-heading mb-4">Redirecting to Secure Checkout...</h1>
      <p className="text-sm text-label font-sans tracking-wide uppercase">Your immersive shopping session is continuing.</p>
    </div>
  );
}

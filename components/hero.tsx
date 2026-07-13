"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";

export function Hero() {
  const [handle, setHandle] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

const handleClaim = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const trimmedHandle = handle.trim();

  if (!trimmedHandle) return;

  router.push(`/sign-up?handle=${encodeURIComponent(trimmedHandle)}`);
};
  return (
    <section className="relative overflow-hidden py-20 md:py-32 flex flex-col items-center text-center">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-8">
        {/* Banner Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none border border-dashed border-primary/40 bg-primary/5 text-primary text-xs uppercase tracking-wider font-bold transition-all duration-700 ease-out transform ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-primary/10" />
          <span>Claim your public feedback handle</span>
        </div>

        {/* Heading */}
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground transition-all duration-1000 delay-100 ease-out transform ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Where honesty meets{" "}
          <span className="text-primary font-black uppercase tracking-tight">
            anonymity.
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ease-out transform ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Receive constructive suggestions, anonymous appreciation, and honest questions from your coworkers, friends, and followers. Safe, structured, and completely secure.
        </p>

        {/* CTA Claim box */}
        <div 
          className={`max-w-md mx-auto w-full pt-4 transition-all duration-1000 delay-300 ease-out transform ${
            mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.97]"
          }`}
        >
          <form 
            onSubmit={handleClaim}
            className="flex flex-col sm:flex-row gap-2 p-2 rounded-none border border-dashed border-border bg-card/40 backdrop-blur-sm focus-within:border-primary transition-all duration-300"
          >
            <div className="flex items-center gap-1.5 flex-1 px-3 py-2 text-sm">
              <span className="text-muted-foreground font-mono select-none text-xs uppercase tracking-wider font-bold">frankly.public/</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="username"
                className="bg-transparent border-none outline-none flex-1 text-foreground font-medium p-0 focus:ring-0 focus:outline-none text-sm"
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-3 rounded-none bg-primary border border-primary text-xs uppercase tracking-wider font-black text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Claim Link
            </button>
          </form>
          
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-4 flex items-center justify-center gap-6">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Anonymous
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-primary fill-primary/10" /> Free Forever
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

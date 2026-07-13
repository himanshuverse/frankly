"use client";

import React, { useState } from "react";
import { Link2, BarChart3, ShieldCheck, Check, Copy, Sparkles, Mail, ShieldAlert, User, Terminal } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function BentoFeatures() {
  const [copied, setCopied] = useState(false);
  const [filterActive, setFilterActive] = useState(true);
  const [hoveredSegment, setHoveredSegment] = useState<"positive" | "suggestion" | "critique" | null>(null);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText("https://frankly.public/alex");
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock messages mapped to sentiment categories
  const sampleMessages = {
    positive: {
      text: "Great work on the backend API migration, speed is 3x faster!",
      category: "Compliment",
      colorClass: "border-emerald-500/20 dark:border-primary/20 bg-emerald-500/5 dark:bg-primary/5 text-emerald-700 dark:text-primary"
    },
    suggestion: {
      text: "Can we transition standups to Slack updates to save time?",
      category: "Suggestion",
      colorClass: "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400"
    },
    critique: {
      text: "The final page layout structure feels a bit rushed and narrow.",
      category: "Critique",
      colorClass: "border-zinc-500/20 bg-zinc-500/5 text-zinc-700 dark:text-zinc-400"
    }
  };

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Core Architecture
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase">
              A feedback system built for growth
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Gather insights that help you improve professionally and personally without the noise of typical social networks.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid: 3 balanced vertical columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: Instantly Shareable */}
          <ScrollReveal delay={100} className="flex flex-col md:col-span-1 h-full">
            <div className="blueprint-panel rounded-none p-6 flex flex-col justify-between shadow-sm blueprint-card relative group overflow-hidden h-full">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center border border-dashed border-primary/20 transition-colors duration-300 group-hover:border-primary">
                  <Link2 className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight">Instantly Shareable</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generate your profile gateway page in seconds. Pin your URL in Slack workspaces, bio headers, or team wikis to launch secure channels.
                </p>
              </div>

              {/* Redesigned User Card & Copy Widget */}
              <div className="mt-8 space-y-4">
                <div className="p-3 bg-muted/30 border border-dashed border-border rounded-none flex items-center gap-3">
                  <div className="w-9 h-9 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs shrink-0 group-hover:border-primary/50 transition-colors">
                    <User className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[10px] font-bold uppercase text-foreground truncate">Alex Carter</h4>
                    <p className="text-[8px] uppercase tracking-wider font-semibold text-zinc-500 mt-0.5">Software Engineer</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-none">
                    <span className="w-1 h-1 rounded-none bg-primary animate-pulse" />
                    <span className="text-[7px] uppercase font-bold text-primary tracking-wider">Online</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-none bg-card border border-dashed border-border flex items-center justify-between gap-2 shadow-inner group-hover:border-primary/30 transition-colors duration-300">
                  <span className="text-[10px] font-mono truncate text-muted-foreground">
                    frankly.public/alex
                  </span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-none border border-dashed border-border bg-muted text-[9px] uppercase font-bold hover:bg-border transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-primary" />
                        <span className="text-primary">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Sentiment Sorting */}
          <ScrollReveal delay={200} className="flex flex-col md:col-span-1 h-full">
            <div className="blueprint-panel rounded-none p-6 flex flex-col justify-between shadow-sm blueprint-card relative group overflow-hidden h-full">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center border border-dashed border-primary/20 transition-colors duration-300 group-hover:border-primary">
                  <BarChart3 className="w-5 h-5 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight">Sentiment Sorting</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automatic categorizer separates appreciation notes, suggestions, and critiques into structured analytics dashboard streams.
                </p>
              </div>

              {/* Redesigned Donut Chart & Vertical Spacing to prevent overlap */}
              <div className="mt-6 flex flex-col gap-6 items-stretch">
                <div className="flex justify-center items-center h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90 transition-transform duration-500">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      className="stroke-muted"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Critique (7%) */}
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      className={`stroke-zinc-500 transition-all duration-300 cursor-pointer ${
                        hoveredSegment === "critique" ? "stroke-[12px]" : "stroke-[8px]"
                      }`}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="226"
                      strokeDashoffset="180"
                      onMouseEnter={() => setHoveredSegment("critique")}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                    {/* Suggestions (15%) */}
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      className={`stroke-amber-500 transition-all duration-300 cursor-pointer ${
                        hoveredSegment === "suggestion" ? "stroke-[12px]" : "stroke-[8px]"
                      }`}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="226"
                      strokeDashoffset="120"
                      onMouseEnter={() => setHoveredSegment("suggestion")}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                    {/* Positive (78%) */}
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      className={`stroke-primary transition-all duration-300 cursor-pointer ${
                        hoveredSegment === "positive" ? "stroke-[12px]" : "stroke-[8px]"
                      }`}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="226"
                      strokeDashoffset="50"
                      onMouseEnter={() => setHoveredSegment("positive")}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  </svg>
                  
                  {/* Absolute Center percentage */}
                  <div className="absolute flex flex-col items-center select-none pointer-events-none">
                    <span className="text-xs font-black uppercase text-foreground">78%</span>
                    <span className="text-[7px] uppercase font-bold text-zinc-500">Positive</span>
                  </div>
                </div>

                {/* Staggered Row Legends below the SVG (No horizontal overlaps!) */}
                <div className="grid grid-cols-3 gap-1 border-t border-dashed border-border pt-4 select-none">
                  <div 
                    className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-200 ${
                      hoveredSegment === "positive" ? "bg-primary/5 border border-primary/20 scale-105" : "border border-transparent"
                    }`}
                    onMouseEnter={() => setHoveredSegment("positive")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <span className="w-1.5 h-1.5 bg-primary mb-1" />
                    <span className="text-[8px] font-bold text-foreground">Positive</span>
                    <span className="text-[7px] text-zinc-500 font-mono">78%</span>
                  </div>
                  <div 
                    className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-200 ${
                      hoveredSegment === "suggestion" ? "bg-amber-500/5 border border-amber-500/20 scale-105" : "border border-transparent"
                    }`}
                    onMouseEnter={() => setHoveredSegment("suggestion")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 mb-1" />
                    <span className="text-[8px] font-bold text-foreground">Ideas</span>
                    <span className="text-[7px] text-zinc-500 font-mono">15%</span>
                  </div>
                  <div 
                    className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-200 ${
                      hoveredSegment === "critique" ? "bg-zinc-500/5 border border-zinc-500/20 scale-105" : "border border-transparent"
                    }`}
                    onMouseEnter={() => setHoveredSegment("critique")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <span className="w-1.5 h-1.5 bg-zinc-500 mb-1" />
                    <span className="text-[8px] font-bold text-foreground">Critique</span>
                    <span className="text-[7px] text-zinc-500 font-mono">7%</span>
                  </div>
                </div>

                {/* Interactive Dynamic Sentiment Preview Box */}
                <div className="h-[52px] flex items-center justify-center">
                  {hoveredSegment ? (
                    <div className={`w-full p-2 border border-dashed rounded-none transition-all duration-300 text-left ${sampleMessages[hoveredSegment].colorClass}`}>
                      <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5">
                        Sample {sampleMessages[hoveredSegment].category}
                      </div>
                      <p className="text-[9px] italic truncate leading-snug">
                        "{sampleMessages[hoveredSegment].text}"
                      </p>
                    </div>
                  ) : (
                    <span className="text-[8px] uppercase tracking-wider font-bold text-zinc-500 text-center animate-pulse">
                      Hover legend columns for sample preview
                    </span>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Harassment Shield */}
          <ScrollReveal delay={300} className="flex flex-col md:col-span-1 h-full">
            <div className="blueprint-panel rounded-none p-6 flex flex-col justify-between shadow-sm blueprint-card relative group overflow-hidden h-full">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center border border-dashed border-primary/20 transition-colors duration-300 group-hover:border-primary">
                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight">Harassment Shield</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time spam screening blocklists dangerous links, offensive slurs, and promotional campaigns automatically.
                </p>
              </div>

              {/* Redesigned Abuse Filter Console widget with terminal log styling */}
              <div className="mt-8 flex flex-col gap-2 relative bg-zinc-950 p-3 border border-dashed border-zinc-900 shadow-inner min-h-[148px]">
                
                {/* Glowing Laser Scanline Overlay */}
                {filterActive && (
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/5 to-primary/0 border-y border-primary/10 pointer-events-none z-10 laser-scan h-full w-full" />
                )}

                <div className="flex items-center justify-between text-[8px] uppercase tracking-wider font-mono pb-2 border-b border-dashed border-zinc-900 mb-1.5 z-20">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-400">Shield Console</span>
                  </div>
                  <button
                    onClick={() => setFilterActive(!filterActive)}
                    className={`text-[8px] px-1.5 py-0.5 rounded-none font-bold font-sans tracking-wide transition-all cursor-pointer border ${filterActive
                        ? "bg-emerald-500 border-emerald-500 text-black"
                        : "bg-muted text-zinc-500 border-dashed border-zinc-800"
                      }`}
                  >
                    {filterActive ? "SHIELD: ON" : "SHIELD: OFF"}
                  </button>
                </div>

                {/* Terminal logs list */}
                <div className="space-y-2 z-20 font-mono text-[8px] leading-tight">
                  <div className="flex items-center justify-between gap-1 text-zinc-500">
                    <span>[LOG] SYSTEM CHECK OK</span>
                    <span className="text-emerald-400">PASS</span>
                  </div>

                  {/* Log item 1 */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-zinc-400 truncate flex-1">
                      {filterActive ? "[LOG] SCAN: 'http://sp...'" : "[MSG] 'Check out this crypto link'"}
                    </span>
                    {filterActive ? (
                      <span className="text-amber-400 font-bold px-1 bg-amber-400/10 border border-amber-400/20 shrink-0">BLOCK</span>
                    ) : (
                      <span className="text-zinc-500 shrink-0">INBOX</span>
                    )}
                  </div>

                  {/* Log item 2 */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-zinc-400 truncate flex-1">
                      [MSG] "Love your meetings!"
                    </span>
                    <span className="text-emerald-400 font-bold px-1 bg-emerald-400/10 border border-emerald-400/20 shrink-0">PASS</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Global CSS for laser-scan */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-30%); }
          50% { transform: translateY(110%); }
          100% { transform: translateY(-30%); }
        }
        .laser-scan {
          animation: scanline 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

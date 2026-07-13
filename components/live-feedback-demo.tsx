"use client";

import React, { useState, useEffect } from "react";
import { Send, Shield, Info, ArrowUpRight, Sparkles, Check } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function LiveFeedbackDemo() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<"Compliment" | "Suggestion" | "Critique" | "General">("General");
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [mockFeedbacks, setMockFeedbacks] = useState<Array<{
    id: number;
    text: string;
    category: "Compliment" | "Suggestion" | "Critique" | "General";
    time: string;
  }>>([
    {
      id: 1,
      text: "You have a great design sense, but sometimes you rush the final layout structure.",
      category: "Suggestion",
      time: "2 hours ago",
    },
    {
      id: 2,
      text: "Outstanding work on the backend API migration, speed is 3x faster now!",
      category: "Compliment",
      time: "4 hours ago",
    },
  ]);

  // Classify category on the fly based on text keywords
  useEffect(() => {
    const text = message.toLowerCase();
    if (text.includes("improve") || text.includes("better") || text.includes("should") || text.includes("change") || text.includes("micromanage")) {
      setCategory("Suggestion");
    } else if (text.includes("great") || text.includes("love") || text.includes("amazing") || text.includes("supportive") || text.includes("awesome")) {
      setCategory("Compliment");
    } else if (text.includes("bad") || text.includes("slow") || text.includes("worst") || text.includes("hate") || text.includes("poor")) {
      setCategory("Critique");
    } else {
      setCategory("General");
    }
  }, [message]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSent(true);

    // Mock receipt of the feedback in the preview dashboard after a small delay
    setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        text: message.trim(),
        category: category,
        time: "Just now",
      };

      setMockFeedbacks([newFeedback, ...mockFeedbacks]);
      setMessage("");
      setIsSent(false);
    }, 800);
  };

  const autofill = (text: string) => {
    setMessage(text);
  };

  const getCategoryStyles = (cat: typeof category) => {
    switch (cat) {
      case "Compliment":
        return "bg-primary/10 text-primary border-primary/20";
      case "Suggestion":
        return "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20";
      case "Critique":
        return "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-500 dark:text-neutral-400 border-neutral-500/20";
    }
  };

  return (
    <div id="demo" className="w-full py-16 md:py-24 border-y border-dashed border-border/40 bg-card/10">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Playground
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase">
              Experience it in real time
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              See how messages are delivered instantly, sorted intelligently, and reviewed privately. Try typing feedback below.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Sender form */}
          <ScrollReveal delay={100} className="flex flex-col h-full">
            <div className="blueprint-panel rounded-none p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden h-full">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-dashed border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-none bg-primary animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-bold text-primary">Public Page Preview</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">frankly.public/alex</span>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-bold uppercase tracking-tight">Send anonymous feedback to @alex</label>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-primary" /> Alex will never know who sent this message.
                  </p>
                </div>

                <form onSubmit={handleSend} className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                      placeholder="Tell @alex what they need to hear, honestly..."
                      className="w-full min-h-[140px] px-4 py-3 rounded-none border border-dashed border-border bg-background/50 hover:bg-background/80 focus:bg-background focus:border-primary focus:outline-none transition-all resize-none text-sm leading-relaxed"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
                      {message.length}/300
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Prompt Quick Suggestions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => autofill("You are amazing at organizing, but you sometimes micromanage details.")}
                        className="text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-none border border-dashed border-border hover:border-primary bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      >
                        💡 Suggestion
                      </button>
                      <button
                        type="button"
                        onClick={() => autofill("I really love how supportive you are when the team is under stress.")}
                        className="text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-none border border-dashed border-border hover:border-primary bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      >
                        🔥 Compliment
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!message.trim() || isSent}
                      className="px-5 py-3 rounded-none bg-primary border border-primary text-xs uppercase tracking-wider font-black text-primary-foreground hover:bg-transparent hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="border-t border-dashed border-border/40 mt-8 pt-4 text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Words like 'improve' or 'great' automatically update the tag classification live!
              </div>
            </div>
          </ScrollReveal>

          {/* Receiver Inbox Mockup */}
          <ScrollReveal delay={200} className="flex flex-col h-full">
            <div className="blueprint-panel rounded-none p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden h-full">
              <div className="space-y-6">
                {/* Mockup Dashboard Header */}
                <div className="flex items-center justify-between border-b border-dashed border-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-none bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-dashed border-primary/20">
                      A
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-tight text-foreground">Alex's Inbox</h4>
                      <p className="text-[8px] uppercase tracking-wider font-bold text-muted-foreground">Private Analytics Cockpit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-none border border-dashed border-border">
                    <span className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse" />
                    <span>Real-time Feed</span>
                  </div>
                </div>

                {/* Feed Cards */}
                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                  {mockFeedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className={`p-4 rounded-none border border-dashed border-border bg-card/60 backdrop-blur-sm transition-all duration-300 ${
                        fb.time === "Just now" ? "border-primary/55 bg-primary/5 shadow-[0_0_12px_rgba(132,204,22,0.08)] scale-[1.01]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-none border ${getCategoryStyles(fb.category)}`}>
                          {fb.category}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground">{fb.time}</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed italic">
                        "{fb.text}"
                      </p>
                      
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-border/40 text-[9px] uppercase tracking-wider font-bold text-muted-foreground">
                        <span className="text-zinc-500">Sender: Anonymous</span>
                        <button
                          onClick={() => fb.id === 1 ? setIsLiked(!isLiked) : setLikes(likes + 1)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-none border border-dashed hover:border-primary hover:text-foreground transition-all cursor-pointer ${
                            (fb.id === 1 && isLiked) ? "border-primary bg-primary/10 text-primary" : "border-border"
                          }`}
                        >
                          <span>Likes</span>
                          <span>({fb.id === 1 ? 4 + (isLiked ? 1 : 0) : fb.time === "Just now" ? likes : 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/40 p-3 rounded-none border border-dashed border-border/40">
                <span>Claim your page handle today</span>
                <a href="/sign-up" className="text-primary inline-flex items-center gap-0.5 hover:underline">
                  Register <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

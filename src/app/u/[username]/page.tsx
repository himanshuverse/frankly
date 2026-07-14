"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";

import {
  MessageSquare,
  Shield,
  Send,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ApiResponse } from "@/src/types/ApiResponse";
import toast from "react-hot-toast";

export default function SendFeedbackPage() {
  const params = useParams();
  const router = useRouter();

  const username =
    typeof params?.username === "string" ? params.username : "user";

  const [message, setMessage] = useState("");

  const [category, setCategory] = useState<
    "General" | "Compliment" | "Suggestion" | "Critique"
  >("General");

  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please write something before sending!");
      return;
    }

    setError("");
    setIsSending(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content: message,
        username,
      });

      setIsSubmitted(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ?? "Failed to send message";

      setError(errorMessage);

      toast("error");
    } finally {
      setIsSending(false);
    }
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-dashed border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-none bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>

            <span className="font-bold text-lg tracking-tight text-foreground">
              frankly<span className="text-primary">.</span>
            </span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="w-full max-w-lg">
          {!isSubmitted ? (
            <div className="blueprint-panel rounded-none p-6 md:p-8 shadow-sm relative overflow-hidden">
              {/* Back indicator */}
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-none bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-dashed border-primary/20 uppercase">
                  {username.slice(0, 2)}
                </div>

                <div>
                  <h1 className="text-xl font-bold uppercase tracking-tight">
                    Send to @{username}
                  </h1>

                  <span className="text-xs text-muted-foreground font-mono">
                    frankly.public/{username}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-none bg-muted/50 border border-dashed border-border/40 text-xs text-muted-foreground flex gap-2.5 mb-6">
                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />

                <span>
                  <strong>Safe & Secure:</strong> All messages delivered are
                  completely anonymous. No IP trackers or browser
                  fingerprinters are stored.
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category selectors */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Feedback Category
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "General",
                        "Compliment",
                        "Suggestion",
                        "Critique",
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`text-xs px-3.5 py-1.5 rounded-none border border-dashed transition-all cursor-pointer ${
                          category === cat
                            ? getCategoryStyles(cat) +
                              " border-solid ring-1 ring-primary/45"
                            : "border-border hover:border-muted-foreground/30 bg-card/60 text-muted-foreground"
                        }`}
                      >
                        {cat === "Compliment" && "💖 "}
                        {cat === "Suggestion" && "💡 "}
                        {cat === "Critique" && "⚠️ "}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Your Message
                  </label>

                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value.slice(0, 300));

                        if (error) {
                          setError("");
                        }
                      }}
                      placeholder={`Tell @${username} something honest, constructive, or encouraging...`}
                      className="w-full min-h-[160px] px-4 py-3 rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all resize-none text-sm leading-relaxed"
                    />

                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
                      {message.length}/300
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-none bg-destructive/10 text-destructive text-xs flex items-center gap-2 border border-dashed border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-none bg-primary border border-primary hover:bg-transparent hover:text-primary disabled:opacity-50 text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isSending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                      <span>Delivering message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Anonymously</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="blueprint-panel rounded-none p-8 text-center shadow-sm relative overflow-hidden space-y-6">
              <div className="mx-auto w-16 h-16 rounded-none bg-primary/10 text-primary border border-dashed border-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold uppercase tracking-tight">
                  Feedback Sent!
                </h1>

                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                  Your message has been delivered to @{username} securely and
                  anonymized. Thank you for your feedback!
                </p>
              </div>

              <div className="p-4 rounded-none border border-dashed border-border bg-card/40 max-w-sm mx-auto text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                  Your Sent Message
                </span>

                <p className="text-sm text-foreground/90 italic font-medium">
                  &quot;{message}&quot;
                </p>
              </div>

              <div className="border-t border-dashed border-border/40 pt-6 max-w-xs mx-auto space-y-4">
                <div className="text-xs text-muted-foreground">
                  Want to collect anonymous feedback from your community?
                </div>

                <Link
                  href="/sign-up"
                  className="w-full py-2.5 rounded-none bg-primary border border-primary text-xs uppercase tracking-wider font-bold text-primary-foreground hover:bg-transparent hover:text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  Create Your frankly Page
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
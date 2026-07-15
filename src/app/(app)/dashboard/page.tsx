"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Inbox,
  BarChart3,
  Settings,
  Copy,
  Check,
  LogOut,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Bell,
  Activity,
  Heart,
  Lightbulb,
  AlertTriangle,
  Star,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema";
import { ApiResponse } from "@/src/types/ApiResponse";
import axios from "axios";
import toast from "react-hot-toast";
import MessageCard, { getFeedbackCategory } from "@/components/message-card";

interface FeedbackItem {
  _id: string | number;
  content: string;
  createdAt: string;
  category?: string;
  isStarred?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const username = session?.user?.username;

  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const profileUrl = username ? `${baseUrl}/u/${username}` : "";

  const [activeTab, setActiveTab] = useState<
    "inbox" | "analytics" | "settings"
  >("inbox");

  const [copied, setCopied] = useState(false);

  const [filterCategory, setFilterCategory] = useState<
    "All" | "Star" | "Compliment" | "Suggestion" | "Critique"
  >("All");

  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { setValue, watch } = form;
  const acceptMessages = watch("isAcceptMsg");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("isAcceptMsg", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setFeedbacks(response.data.messages || []);
      if (refresh) {
        toast.success("Feed refreshed successfully");
      }
    } catch (error: any) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    if (isSwitchLoading) return;
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      if (response.data.success) {
        setValue("isAcceptMsg", !acceptMessages);
        toast.success(
          !acceptMessages
            ? "Now accepting anonymous feedback!"
            : "Feedback portal paused"
        );
      }
    } catch (error) {
      toast.error("Failed to change status");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const handleCopy = async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const deleteFeedback = (id: string | number) => {
    setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));
  };

  const handleToggleStarState = (id: string | number, isStarred: boolean) => {
    setFeedbacks((prev) =>
      prev.map((feedback) =>
        feedback._id === id ? { ...feedback, isStarred } : feedback
      )
    );
  };

  if (status === "loading" || !baseUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative space-y-4 text-center">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-none animate-spin mx-auto" />
          <p className="text-[10px] uppercase tracking-widest font-black text-primary animate-pulse">
            LOADING PORTAL INTERFACE...
          </p>
        </div>
      </div>
    );
  }

  const getCountByCategory = (cat: string) => {
    if (cat === "All") return feedbacks.length;
    if (cat === "Star") return feedbacks.filter((f) => f.isStarred).length;
    return feedbacks.filter(
      (feedback) =>
        (feedback.category || getFeedbackCategory(feedback.content)) === cat
    ).length;
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filterCategory === "All") {
      return true;
    }
    if (filterCategory === "Star") {
      return !!feedback.isStarred;
    }
    const category = feedback.category || getFeedbackCategory(feedback.content);
    return category === filterCategory;
  });

  // Calculate detailed stats for Analytics page
  const totalCount = feedbacks.length;
  const starredCount = getCountByCategory("Star");
  const complimentsCount = getCountByCategory("Compliment");
  const suggestionsCount = getCountByCategory("Suggestion");
  const critiquesCount = getCountByCategory("Critique");
  const generalCount = getCountByCategory("General");

  const complimentsPct = totalCount
    ? Math.round((complimentsCount / totalCount) * 100)
    : 0;
  const suggestionsPct = totalCount
    ? Math.round((suggestionsCount / totalCount) * 100)
    : 0;
  const critiquesPct = totalCount
    ? Math.round((critiquesCount / totalCount) * 100)
    : 0;
  const generalPct = totalCount
    ? Math.round((generalCount / totalCount) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden font-sans">
      {/* Background blueprint grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      {/* Navbar Header */}
      <header className="border-b border-dashed border-border/40 bg-card/10 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-none bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(132,204,22,0.15)] group-hover:scale-105 transition-transform duration-250">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              frankly<span className="text-primary font-black">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="flex items-center gap-2.5 pl-3 border-l border-dashed border-border/40">
              {username && (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-7 h-7 rounded-none bg-primary/10 border border-dashed border-primary/30 flex items-center justify-center text-[10px] font-black uppercase text-primary">
                    {username.slice(0, 2)}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    {username}
                  </span>
                </div>
              )}
              <Button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-black text-muted-foreground hover:text-foreground py-1.5 px-3 rounded-none border border-dashed border-border/80 bg-card/20 hover:bg-card/40 cursor-pointer transition-colors"
              >
                Log Out
                <LogOut className="w-3.5 h-3.5 text-muted-foreground/60" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Share Link Banner Console */}
      <div className="border-b border-dashed border-border/30 bg-muted/5 backdrop-blur-md py-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 border border-dashed border-primary/30 text-primary">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                Share Portal Active
              </p>
              <h2 className="text-xs font-bold text-foreground flex items-center gap-1.5 font-mono">
                {username ? `@${username}` : "anonymous"}
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 sm:w-80 flex items-center bg-card/40 border border-dashed border-border/85 px-3.5 py-2 text-xs font-mono text-muted-foreground group hover:border-primary/40 transition-colors">
              <span className="truncate select-all text-foreground/80 font-semibold pr-4">
                {profileUrl}
              </span>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={profileUrl}
                target="_blank"
                className="px-4 py-2 rounded-none border border-dashed border-border/85 bg-card/20 hover:bg-card/40 text-[9px] uppercase font-black tracking-widest text-muted-foreground hover:text-foreground transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                View Live
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-none bg-primary border border-primary text-primary-foreground text-[9px] uppercase tracking-widest font-black flex items-center justify-center gap-1.5 active:scale-95 hover:bg-transparent hover:text-primary transition-all cursor-pointer shadow-[0_0_15px_rgba(132,204,22,0.15)]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 md:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-2.5">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2.5 lg:pb-0 border-b lg:border-none border-dashed border-border/30">
            {/* Inbox Feed Tab */}
            <button
              onClick={() => setActiveTab("inbox")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-xs uppercase tracking-wider font-extrabold transition-all duration-200 cursor-pointer shrink-0 border ${activeTab === "inbox"
                  ? "bg-primary/5 text-primary border-primary/30 border-l-4 shadow-[inset_3px_0_0_0_rgba(132,204,22,0.4)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-transparent"
                }`}
            >
              <span className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Inbox Feed</span>
              </span>
              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 border border-dashed rounded-none ${activeTab === "inbox"
                    ? "border-primary/30 text-primary bg-primary/10"
                    : "border-border text-muted-foreground bg-muted/40"
                  }`}
              >
                {feedbacks.length}
              </span>
            </button>

            {/* Analytics Tab */}
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-xs uppercase tracking-wider font-extrabold transition-all duration-200 cursor-pointer shrink-0 border ${activeTab === "analytics"
                  ? "bg-primary/5 text-primary border-primary/30 border-l-4 shadow-[inset_3px_0_0_0_rgba(132,204,22,0.4)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-transparent"
                }`}
            >
              <span className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                <Activity className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Settings Tab */}
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-xs uppercase tracking-wider font-extrabold transition-all duration-200 cursor-pointer shrink-0 border ${activeTab === "settings"
                  ? "bg-primary/5 text-primary border-primary/30 border-l-4 shadow-[inset_3px_0_0_0_rgba(132,204,22,0.4)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-transparent"
                }`}
            >
              <span className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${acceptMessages ? "bg-primary" : "bg-neutral-500"
                  }`}
              />
            </button>
          </nav>
        </aside>

        {/* Dynamic Tab Body */}
        <main className="lg:col-span-3 space-y-6">
          {/* INBOX FEED */}
          {activeTab === "inbox" && (
            <div className="space-y-6">
              {/* Inbox Header Controls */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-dashed border-border/30 pb-4">
                <h2 className="text-sm uppercase font-black tracking-wider flex items-center gap-2">
                  Feedback Feed
                  <span className="text-[9px] px-2 py-0.5 rounded-none border border-dashed border-border bg-muted/40 text-muted-foreground font-bold font-mono">
                    {feedbacks.length} Total
                  </span>
                </h2>

                {/* Filter Pills with counters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
                  {(
                    ["All", "Star", "Compliment", "Suggestion", "Critique"] as const
                  ).map((category) => {
                    const count = getCountByCategory(category);
                    const isActive = filterCategory === category;
                    let dotColor = "bg-primary";
                    if (category === "Compliment") dotColor = "bg-pink-500";
                    if (category === "Suggestion") dotColor = "bg-blue-400";
                    if (category === "Critique") dotColor = "bg-red-500";
                    if (category === "Star") dotColor = "bg-amber-400";

                    return (
                      <button
                        key={category}
                        onClick={() => setFilterCategory(category)}
                        className={`text-[9px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-none border transition-all cursor-pointer flex items-center gap-2 shrink-0 ${isActive
                            ? "bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(132,204,22,0.15)] font-black"
                            : "border-border/60 hover:border-muted-foreground/40 bg-card/45 text-muted-foreground"
                          }`}
                      >
                        {category === "Star" ? (
                          <Star className={`w-3 h-3 text-amber-400 ${isActive ? "fill-primary-foreground" : "fill-amber-400/40"}`} />
                        ) : (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isActive ? "animate-pulse" : ""
                              }`}
                          />
                        )}
                        <span>{category}</span>
                        <span
                          className={`text-[8px] font-mono font-bold ml-1 px-1 py-0.2 border ${isActive
                              ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                              : "border-border text-muted-foreground/60 bg-muted/10"
                            }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feed Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="border border-dashed border-border/60 bg-card/10 p-5 space-y-4 animate-pulse relative"
                    >
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-4 bg-muted" />
                        <div className="w-12 h-3 bg-muted" />
                      </div>
                      <div className="w-full h-10 bg-muted" />
                      <div className="w-full h-px bg-dashed border-t border-border/10" />
                      <div className="flex justify-between items-center">
                        <div className="w-14 h-3 bg-muted" />
                        <div className="w-6 h-6 bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((feedback) => (
                      <MessageCard
                        key={feedback._id}
                        feedback={feedback}
                        onDelete={deleteFeedback}
                        onToggleStar={handleToggleStarState}
                      />
                    ))
                  ) : (
                    /* Beautified Empty State */
                    <div className="col-span-1 md:col-span-2 text-center py-20 border border-dashed border-border/80 bg-card/5 rounded-none space-y-4 relative overflow-hidden flex flex-col items-center justify-center">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-muted-foreground/30" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-muted-foreground/30" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-muted-foreground/30" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-muted-foreground/30" />

                      <div className="w-12 h-12 rounded-none border border-dashed border-border/60 flex items-center justify-center bg-card text-muted-foreground/80">
                        {filterCategory === "Star" ? (
                          <Star className="w-6 h-6 animate-pulse text-amber-400" />
                        ) : (
                          <Inbox className="w-6 h-6 animate-bounce" />
                        )}
                      </div>

                      <div className="space-y-1.5 max-w-sm px-4">
                        <p className="text-xs uppercase tracking-widest font-black text-foreground">
                          {feedbacks.length === 0
                            ? "No feedbacks received yet"
                            : filterCategory === "Star"
                              ? "No starred messages"
                              : "No matches found"}
                        </p>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feedbacks.length === 0
                            ? "Share your custom feedback link with your audience to begin receiving honest, constructive anonymous messages."
                            : filterCategory === "Star"
                              ? "Star your favorite messages to quickly find them under this tab later."
                              : `There are currently no feedback entries matching the "${filterCategory.toLowerCase()}" category.`}
                        </p>
                      </div>

                      {feedbacks.length === 0 && (
                        <button
                          onClick={handleCopy}
                          className="px-4 py-2 mt-2 rounded-none border border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary transition-all text-[9px] uppercase font-black tracking-widest active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(132,204,22,0.1)]"
                        >
                          {copied ? "Copied Link" : "Copy Your Link"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS PANEL */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-sm uppercase font-black tracking-wider border-b border-dashed border-border/30 pb-4">
                Feedback Analytics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Total Received */}
                <div className="relative border border-dashed border-border bg-card/30 backdrop-blur-sm p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-muted-foreground/30" />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-muted-foreground/30" />
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Total Delivered
                  </span>
                  <span className="text-4xl font-black block mt-2 text-foreground font-mono">
                    {totalCount}
                  </span>
                  <div className="w-full bg-border/20 h-1.5 mt-4 rounded-none overflow-hidden relative">
                    <div className="bg-primary h-full w-full" />
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 mt-2 block uppercase font-bold tracking-wider">
                    {starredCount} Starred Favorites
                  </span>
                </div>

                {/* Sentiment Distribution Card - Pink */}
                <div className="relative border border-dashed border-border bg-card/30 backdrop-blur-sm p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-muted-foreground/30" />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-muted-foreground/30" />
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Compliment Ratio
                  </span>
                  <span className="text-4xl font-black block mt-2 text-pink-500 font-mono">
                    {complimentsPct}%
                  </span>
                  <div className="w-full bg-border/20 h-1.5 mt-4 rounded-none overflow-hidden relative">
                    <div
                      className="bg-pink-500 h-full transition-all duration-500"
                      style={{ width: `${complimentsPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 mt-2 block uppercase font-bold tracking-wider">
                    {complimentsCount} Compliments received
                  </span>
                </div>

                {/* Positive Sentiment Indicator - Blue */}
                <div className="relative border border-dashed border-border bg-card/30 backdrop-blur-sm p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-muted-foreground/30" />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-muted-foreground/30" />
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Suggestions Ratio
                  </span>
                  <span className="text-4xl font-black block mt-2 text-blue-400 font-mono">
                    {suggestionsPct}%
                  </span>
                  <div className="w-full bg-border/20 h-1.5 mt-4 rounded-none overflow-hidden relative">
                    <div
                      className="bg-blue-400 h-full transition-all duration-500"
                      style={{ width: `${suggestionsPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 mt-2 block uppercase font-bold tracking-wider">
                    {suggestionsCount} Ideas / suggestions
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="border border-dashed border-border bg-card/20 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-muted-foreground/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-muted-foreground/30" />

                {totalCount === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-xs uppercase tracking-widest font-black">
                      No metrics available yet
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Analytics metrics and visual distributions will display
                      here once feedback is received.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider">
                        Category Breakdown Summary
                      </h3>
                      <span className="text-[9px] font-mono bg-muted/60 px-2 py-0.5 text-muted-foreground">
                        {totalCount} Total Entries
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Compliments Progress Bar - Pink */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                          <span className="flex items-center gap-1.5 text-pink-500">
                            <Heart className="w-3.5 h-3.5 fill-pink-500/10" />
                            Compliments
                          </span>
                          <span className="font-mono">
                            {complimentsCount} ({complimentsPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-border/20 h-2.5 rounded-none overflow-hidden">
                          <div
                            className="bg-pink-500 h-full transition-all duration-500"
                            style={{ width: `${complimentsPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Suggestions Progress Bar - Blue */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                          <span className="flex items-center gap-1.5 text-blue-400">
                            <Lightbulb className="w-3.5 h-3.5" />
                            Suggestions
                          </span>
                          <span className="font-mono">
                            {suggestionsCount} ({suggestionsPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-border/20 h-2.5 rounded-none overflow-hidden">
                          <div
                            className="bg-blue-500 h-full transition-all duration-500"
                            style={{ width: `${suggestionsPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Critiques Progress Bar - Red */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                          <span className="flex items-center gap-1.5 text-red-500">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Critiques
                          </span>
                          <span className="font-mono">
                            {critiquesCount} ({critiquesPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-border/20 h-2.5 rounded-none overflow-hidden">
                          <div
                            className="bg-red-500 h-full transition-all duration-500"
                            style={{ width: `${critiquesPct}%` }}
                          />
                        </div>
                      </div>

                      {/* General Progress Bar - Indigo */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                          <span className="flex items-center gap-1.5 text-indigo-400">
                            <MessageSquare className="w-3.5 h-3.5" />
                            General / Other
                          </span>
                          <span className="font-mono">
                            {generalCount} ({generalPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-border/20 h-2.5 rounded-none overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full transition-all duration-500"
                            style={{ width: `${generalPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS PANEL */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-sm uppercase font-black tracking-wider border-b border-dashed border-border/30 pb-4">
                Dashboard Settings
              </h2>

              <div className="border border-dashed border-border bg-card/20 p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-muted-foreground/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-muted-foreground/30" />

                {/* Spam Filter Mockup Section */}
                <div className="flex items-start justify-between gap-4 flex-wrap pb-6 border-b border-dashed border-border/20">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-sm flex items-center gap-2 uppercase tracking-tight">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      AI Spam & Harassment Filter
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                      Protect your feed from hate speech, toxic comments, and
                      malicious spam links. Flagged feedback will be quarantined automatically.
                    </p>
                  </div>

                  {/* Pulsing Coming Soon Badge */}
                  <div className="relative overflow-hidden bg-primary/5 px-3.5 py-1.5 border border-dashed border-primary/30 flex items-center gap-2 select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-75 rounded-full" />
                      <span className="relative inline-flex h-2 w-2 bg-primary rounded-full" />
                    </span>
                    <span className="relative text-[9px] uppercase font-black tracking-widest text-primary">
                      COMING SOON
                    </span>
                  </div>
                </div>

                {/* Toggle Accept Messages Switch */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-sm flex items-center gap-2 uppercase tracking-tight">
                      <Bell className="w-4 h-4 text-primary" />
                      Accept Messages Status
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                      Control the active status of your feedback page. Disabling this will prevent anyone from submitting anonymous feedback.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSwitchChange}
                    className={`w-14 h-7 rounded-none transition-all relative border cursor-pointer p-0.5 ${acceptMessages
                        ? "bg-primary/10 border-primary shadow-[0_0_12px_rgba(132,204,22,0.15)]"
                        : "bg-muted/50 border-dashed border-border"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 bottom-0.5 w-6 rounded-none transition-all duration-300 flex items-center justify-center text-[8px] font-black uppercase ${acceptMessages
                          ? "left-7 bg-primary text-black"
                          : "left-0.5 bg-neutral-600 text-neutral-300"
                        }`}
                    >
                      {acceptMessages ? "ON" : "OFF"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
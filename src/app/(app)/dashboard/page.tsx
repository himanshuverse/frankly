"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Inbox,
  Star,
  BarChart3,
  Settings,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
  Bell,
  LogOut,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema";
import { ApiResponse } from "@/src/types/ApiResponse";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface FeedbackItem {
  _id: number;
  content: string;
  createdAt: string;
  category ?:string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const username = session?.user?.username;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;


  const [activeTab, setActiveTab] = useState<
    "inbox" | "analytics" | "settings"
  >("inbox");

  const [copied, setCopied] = useState(false);

  const [filterCategory, setFilterCategory] = useState<
    "All" | "Compliment" | "Suggestion" | "Critique"
  >("All");

  const [isAcceptingMessages, setIsAcceptingMessages] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('isAcceptMsg');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('isAcceptMsg', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        'Failed to fetch message settings',);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

 const fetchMessages = useCallback(
  async (refresh: boolean = false) => {
    setIsLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");

      console.log("API RESPONSE:", response.data);
      console.log("MESSAGES:", response.data.messages);

      setFeedbacks(response.data.messages || []);

      if (refresh) {
        toast("Showing latest messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      console.error(
        "Failed to fetch messages:",
        axiosError.response?.data || axiosError.message
      );

      toast("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  },
  []
);

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);


  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('isAcceptMsg', !acceptMessages);
      toast('success');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('failed');
    }
  };


  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const handleCopy = async () => {
    if (!username) return;

    try {
      await navigator.clipboard.writeText(profileUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }


  const deleteFeedback = (id: number) => {
    setFeedbacks((prev) =>
      prev.filter((feedback) => feedback._id !== id)
    );
  };

 
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filterCategory === "All") {
      return true;
    }

    return feedback.category === filterCategory;
  });

  const getCategoryStyles = (
    category: FeedbackItem["category"]
  ) => {
    switch (category) {
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="border-b border-dashed border-border/40 bg-card/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-none bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>

            <span className="font-bold text-lg tracking-tight text-foreground">
              frankly<span className="text-primary">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <Button
              onClick={handleSignOut}
              className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground py-1.5 px-3 rounded-none border border-dashed border-border bg-card/40 cursor-pointer"
            >
              Log Out
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Share Link Banner */}
      <div className="border-b border-dashed border-border/20 bg-muted/10 py-3">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />

            <span>Your share link is active:</span>

            <span className="font-mono text-foreground font-semibold underline decoration-primary/50 decoration-2">
              {profileUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href={profileUrl}
              target="_blank"
              className="px-3 py-1.5 rounded-none border border-dashed border-border bg-card text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View Public Page
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-none bg-primary border border-primary text-primary-foreground text-[10px] uppercase tracking-wider font-black flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied Link</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 md:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 border-b lg:border-none border-dashed border-border/40">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-none text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 ${activeTab === "inbox"
                ? "bg-primary/10 text-primary border border-dashed border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
                }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inbox Feed</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-none text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 ${activeTab === "analytics"
                ? "bg-primary/10 text-primary border border-dashed border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-none text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 ${activeTab === "settings"
                ? "bg-primary/10 text-primary border border-dashed border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
                }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Dynamic Tab Body */}
        <main className="lg:col-span-3 space-y-6">
          {/* INBOX */}
          {activeTab === "inbox" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-dashed border-border/40 pb-4">
                <h2 className="text-md uppercase font-black tracking-tight flex items-center gap-2">
                  Feedback Received

                  <span className="text-[10px] px-2 py-0.5 rounded-none border border-dashed border-border bg-muted text-muted-foreground font-bold">
                    {feedbacks.length}{" "}
                    {feedbacks.length === 1
                      ? "message"
                      : "messages"}
                  </span>
                </h2>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(
                    [
                      "All",
                      "Compliment",
                      "Suggestion",
                      "Critique",
                    ] as const
                  ).map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setFilterCategory(category)
                      }
                      className={`text-[10px] uppercase font-bold px-3 py-1 rounded-none border transition-all cursor-pointer ${filterCategory === category
                        ? "bg-primary border-primary text-black"
                        : "border-border hover:border-muted-foreground/30 bg-card text-muted-foreground"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((feedback) => (
               <div key={feedback._id}
                      className="blueprint-panel rounded-none p-5 shadow-sm blueprint-card flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-none border ${getCategoryStyles(
                              feedback.category
                            )}`}
                          >
                            {feedback.category}
                          </span>

                          <span className="text-[10px] text-muted-foreground">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed text-foreground/90 font-medium italic mb-6">
                          &quot;{feedback.content}&quot;
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between border-t border-dashed border-border/20 pt-4">
                        <div className="flex gap-2">
                        </div>

                        <div className="flex items-center gap-3">
                          
                          <button
                            onClick={() =>
                              deleteFeedback(feedback._id)
                            }
                            className="p-1.5 rounded-none border border-transparent hover:border-red-500/20 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 text-center py-16 border border-dashed border-border rounded-none space-y-3">
                    <Inbox className="w-8 h-8 text-muted-foreground mx-auto" />

                    <p className="text-xs uppercase tracking-wider font-bold">
                      {feedbacks.length === 0
                        ? "No messages yet"
                        : "No feedback found"}
                    </p>

                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      {feedbacks.length === 0
                        ? "Share your custom link to start receiving anonymous feedback."
                        : `No ${filterCategory.toLowerCase()} feedback found.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-md uppercase font-black tracking-tight border-b border-dashed border-border/40 pb-4">
                Feedback Analytics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="blueprint-panel rounded-none p-5 text-center">
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Total Delivered
                  </span>

                  <span className="text-3xl font-black block mt-1">
                    {feedbacks.length}
                  </span>

                  <span className="text-[9px] text-muted-foreground mt-1 block uppercase font-bold tracking-wider">
                    Total received
                  </span>
                </div>

                <div className="blueprint-panel rounded-none p-5 text-center">
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Public Showcased
                  </span>

                  

                  <span className="text-[9px] text-muted-foreground mt-1 block uppercase font-bold tracking-wider">
                    Listed on profile
                  </span>
                </div>

                <div className="blueprint-panel rounded-none p-5 text-center">
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Compliments
                  </span>

                  <span className="text-3xl font-black block mt-1 text-primary">
                    {
                      feedbacks.filter(
                        (feedback) =>
                          feedback.category === "Compliment"
                      ).length
                    }
                  </span>

                  <span className="text-[9px] text-muted-foreground mt-1 block uppercase font-bold tracking-wider">
                    Positive feedback
                  </span>
                </div>
              </div>

              <div className="blueprint-panel rounded-none p-6 text-center shadow-sm">
                {feedbacks.length === 0 ? (
                  <>
                    <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />

                    <p className="text-xs uppercase tracking-wider font-bold">
                      No analytics available yet
                    </p>

                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2">
                      Analytics will appear once you start
                      receiving anonymous feedback.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-base uppercase tracking-tight mb-2">
                      Category Distribution
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      You have received {feedbacks.length} feedback
                      messages.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-md uppercase font-black tracking-tight border-b border-dashed border-border/40 pb-4">
                Dashboard Settings
              </h2>

              <div className="blueprint-panel rounded-none p-6 space-y-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm flex items-center gap-1.5 uppercase tracking-tight">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      AI Spam & Harassment Filter
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                      Flag and quarantine hateful comments, swear words, and malicious
                      links before delivering them.
                    </p>
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="relative overflow-hidden bg-muted px-3 py-1.5 rounded-none border border-dashed border-primary">
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                    <span className="relative flex items-center gap-1.5 text-[9px] uppercase font-black tracking-wider text-primary">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 bg-primary" />
                      </span>

                      Coming Soon
                    </span>
                  </div>
                </div>

                <hr className="border-dashed border-border/40" />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm flex items-center gap-1.5 uppercase tracking-tight">
                      <Bell className="w-4 h-4 text-primary" />
                      Accept Messages
                    </h3>

                    <p className="text-xs text-muted-foreground max-w-md">
                      When enabled, people can message you directly. Turn off anytime to stop receiving new messages
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSwitchChange}
                    className={`w-12 h-6 rounded-none transition-all relative border cursor-pointer ${acceptMessages
                      ? "bg-primary border-primary"
                      : "bg-muted border-dashed border-border"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none transition-all ${acceptMessages
                        ? "translate-x-6 bg-black"
                        : "translate-x-0 bg-neutral-400 dark:bg-neutral-600"
                        }`}
                    />
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
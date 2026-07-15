"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Lightbulb, 
  AlertTriangle, 
  MessageSquare, 
  Trash2, 
  Copy, 
  Check, 
  Clock,
  X,
  Star
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface FeedbackItem {
  _id: string | number;
  content: string;
  createdAt: string | Date;
  category?: string;
  isStarred?: boolean;
}

interface MessageCardProps {
  feedback: FeedbackItem;
  onDelete: (id: string | number) => void;
  onToggleStar?: (id: string | number, isStarred: boolean) => void;
}

// Simple rule-based classifier to make categories functional and dynamic
export function getFeedbackCategory(content: string): "Compliment" | "Suggestion" | "Critique" | "General" {
  const text = content.toLowerCase();
  
  // Critique signals (Red)
  if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("broken") ||
    text.includes("fail") ||
    text.includes("worst") ||
    text.includes("bad") ||
    text.includes("hate") ||
    text.includes("slow") ||
    text.includes("issue") ||
    text.includes("fix")
  ) {
    return "Critique";
  }
  
  // Suggestion signals (Blue)
  if (
    text.includes("should") ||
    text.includes("could") ||
    text.includes("would") ||
    text.includes("maybe") ||
    text.includes("suggest") ||
    text.includes("improve") ||
    text.includes("add") ||
    text.includes("feature") ||
    text.includes("idea") ||
    text.includes("please") ||
    text.includes("can you")
  ) {
    return "Suggestion";
  }

  // Compliment signals (Pink)
  if (
    text.includes("love") ||
    text.includes("great") ||
    text.includes("awesome") ||
    text.includes("good") ||
    text.includes("perfect") ||
    text.includes("amazing") ||
    text.includes("beautiful") ||
    text.includes("wonderful") ||
    text.includes("thanks") ||
    text.includes("thank you") ||
    text.includes("nice") ||
    text.includes("cool")
  ) {
    return "Compliment";
  }

  return "General";
}

export default function MessageCard({ feedback, onDelete, onToggleStar }: MessageCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isStarred, setIsStarred] = useState(feedback.isStarred || false);
  const [isStarring, setIsStarring] = useState(false);

  // Auto-classify category if not defined
  const category = feedback.category || getFeedbackCategory(feedback.content);

  // Auto reset delete confirmation after 3 seconds
  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => {
      setConfirmDelete(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  // Sync internal star state with external prop changes
  useEffect(() => {
    setIsStarred(feedback.isStarred || false);
  }, [feedback.isStarred]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedback.content);
      setCopied(true);
      toast.success("Feedback content copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleToggleStar = async () => {
    if (isStarring) return;
    setIsStarring(true);
    try {
      const response = await axios.post(`/api/toggle-star/${feedback._id}`);
      if (response.data.success) {
        const nextStarred = response.data.isStarred;
        setIsStarred(nextStarred);
        toast.success(nextStarred ? "Starred message!" : "Unstarred message");
        if (onToggleStar) {
          onToggleStar(feedback._id, nextStarred);
        }
      }
    } catch (error) {
      console.error("Star toggle error:", error);
      toast.error("Failed to star message");
    } finally {
      setIsStarring(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/delete-message/${feedback._id}`);
      if (response.data.success) {
        toast.success("Feedback deleted successfully");
        onDelete(feedback._id);
      } else {
        toast.error(response.data.message || "Failed to delete message");
      }
    } catch (error: any) {
      console.error("Delete request error:", error);
      toast.error(error.response?.data?.message || "Error deleting message");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Pink for Compliment, Blue for Suggestion, Red for Critique
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case "Compliment":
        return {
          icon: <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />,
          styles: "bg-pink-500/10 text-pink-400 border-pink-500/20 glow-pink",
          badgeBg: "border-pink-500/30 text-pink-400 bg-pink-500/5",
        };
      case "Suggestion":
        return {
          icon: <Lightbulb className="w-3.5 h-3.5 text-blue-400 fill-blue-400/10" />,
          styles: "bg-blue-500/10 text-blue-400 border-blue-500/20 glow-blue",
          badgeBg: "border-blue-500/30 text-blue-400 bg-blue-500/5",
        };
      case "Critique":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />,
          styles: "bg-red-500/10 text-red-400 border-red-500/20 glow-red",
          badgeBg: "border-red-500/30 text-red-400 bg-red-500/5",
        };
      default:
        return {
          icon: <MessageSquare className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10" />,
          styles: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 glow-indigo",
          badgeBg: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
        };
    }
  };

  const meta = getCategoryMeta(category);

  return (
    <div 
      className={`relative border bg-card/30 backdrop-blur-md transition-all duration-300 group overflow-hidden select-none hover:bg-card/60 flex flex-col justify-between ${
        confirmDelete 
          ? "border-destructive/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]" 
          : "border-border/60 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(132,204,22,0.08)]"
      } ${isDeleting ? "opacity-40 pointer-events-none scale-[0.98]" : ""}`}
    >
      {/* Visual cybertech accent corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-muted-foreground/30 group-hover:border-primary/60 transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-muted-foreground/30 group-hover:border-primary/60 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-muted-foreground/30 group-hover:border-primary/60 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-muted-foreground/30 group-hover:border-primary/60 transition-colors" />

      {/* Grid line effect top edge */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-border/50 to-transparent group-hover:via-primary/30 transition-colors" />

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Card Header Info */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-none border border-dashed transition-all ${meta.badgeBg}`}
            >
              {meta.icon}
              {category}
            </span>

            <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-muted-foreground/60" />
              {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Feedback content */}
          <p className="text-sm leading-relaxed text-foreground/90 font-medium italic relative pl-4 border-l-2 border-dashed border-border/80 group-hover:border-primary/40 transition-colors my-4 py-1">
            &quot;{feedback.content}&quot;
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between border-t border-dashed border-border/20 pt-4 mt-4">
          <span className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider">
            ANONYMOUS
          </span>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`p-2 rounded-none border border-dashed transition-all cursor-pointer ${
                copied 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                  : "border-border/40 hover:border-primary/30 hover:bg-primary/5 text-muted-foreground hover:text-primary"
              }`}
              title="Copy content"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Star Toggle Button */}
            <button
              onClick={handleToggleStar}
              disabled={isStarring}
              className={`p-2 rounded-none border border-dashed transition-all cursor-pointer disabled:opacity-50 ${
                isStarred
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-border/40 hover:border-amber-500/30 hover:bg-amber-500/5 text-muted-foreground hover:text-amber-500"
              }`}
              title={isStarred ? "Unstar message" : "Star message"}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-amber-500/40 text-amber-400" : ""}`} />
            </button>

            {/* Delete Confirmation or Normal Delete Button */}
            {confirmDelete ? (
              <div className="flex items-center border border-dashed border-destructive/30 bg-destructive/5 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2.5 py-1.5 text-[9px] font-black uppercase text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete?"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="p-1.5 border-l border-dashed border-destructive/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleDelete}
                className="p-2 rounded-none border border-dashed border-border/40 hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                title="Delete feedback"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

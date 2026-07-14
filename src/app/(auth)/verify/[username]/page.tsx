"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  MessageSquare,
  ShieldCheck,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import axios from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { verifySchema } from "@/src/schemas/verifySchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const username = params?.username || "";

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // Watch the verification code for button state
  const code = form.watch("code");

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSubmit = async (
    data: z.infer<typeof verifySchema>
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post<ApiResponse>(
        "/api/verify-code",
        {
          username: decodeURIComponent(username),
          code: data.code,
        }
      );

      if (response.data.success) {
        setToastMessage({
          text:
            response.data.message ||
            "Verification successful",
          type: "success",
        });

        setTimeout(() => {
          router.replace("/sign-in");
        }, 1200);
      }
    } catch (err) {
      console.error("Verification error:", err);

      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          "Verification failed";

        setError(message);

        setToastMessage({
          text: message,
          type: "error",
        });
      } else {
        setError("Something went wrong");

        setToastMessage({
          text: "Something went wrong",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background bg-grid-pattern relative">

      {/* Custom Floating Toast */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 border border-dashed shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-in ${
            toastMessage.type === "success"
              ? "border-primary bg-primary/10 text-primary"
              : "border-red-500 bg-red-500/10 text-red-500"
          }`}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
            {toastMessage.type === "success" ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}

            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full border-b border-dashed border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

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

          <ThemeToggle />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="w-full max-w-md">

          <div className="blueprint-panel rounded-none p-6 md:p-8 shadow-sm relative overflow-hidden space-y-6 bg-card/40 backdrop-blur-sm">

            {/* Pulse Anchor Corners */}
            <span className="absolute -top-px -left-px h-1.5 w-1.5 bg-primary animate-pulse" />
            <span className="absolute -top-px -right-px h-1.5 w-1.5 bg-primary animate-pulse" />
            <span className="absolute -bottom-px -left-px h-1.5 w-1.5 bg-primary animate-pulse" />
            <span className="absolute -right-px -bottom-px h-1.5 w-1.5 bg-primary animate-pulse" />

            <div className="text-center">

              <div className="w-10 h-10 mx-auto rounded-none bg-primary/10 text-primary flex items-center justify-center border border-dashed border-primary/20 mb-2">
                <KeyRound className="w-5 h-5" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight uppercase text-foreground">
                Verify Your Account
              </h1>

              <p className="text-xs text-muted-foreground mt-1">
                Enter the verification code sent to your email for{" "}
                <span className="font-bold text-foreground">
                  @{decodeURIComponent(username)}
                </span>
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-1 block">

                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Verification Code
                </label>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  {...form.register("code", {
                    onChange: (e) => {
                      const numericValue =
                        e.target.value.replace(/[^0-9]/g, "");

                      form.setValue("code", numericValue, {
                        shouldValidate: true,
                      });

                      setError("");
                    },
                  })}
                  className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                />

                {(form.formState.errors.code || error) && (
                  <p className="text-[10px] uppercase font-bold text-red-500 mt-1 block">
                    {form.formState.errors.code?.message || error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={code?.length !== 6 || isLoading}
                className="w-full py-3 mt-2 rounded-none bg-primary border border-primary text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Please wait</span>
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-dashed border-border/20 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider font-bold">

          <ShieldCheck className="w-4 h-4 text-primary" />

          <span>Secured Verification Portal.</span>
        </div>
      </footer>
    </div>
  );
}
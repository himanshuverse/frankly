"use client"

import { signInSchema } from "@/src/schemas/signInSchema"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { useState } from "react"


export default function signInPage() {
  const[isLoading,setIsLoading] =useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true)
       try {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Incorrect email or password");
      } else {
        toast.error("Something went wrong");
      }

      return;
    }

    if (result?.ok) {
      toast.success("Signed in successfully");
      router.replace("/dashboard");
      router.refresh();
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background bg-grid-pattern">
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
        <div className="w-full max-w-md">
          <div className="blueprint-panel rounded-none p-6 md:p-8 shadow-sm relative overflow-hidden space-y-6 bg-card/40 backdrop-blur-sm">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight uppercase text-foreground">
                Welcome Back
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Sign in to access your feedback inbox
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup className="space-y-4">
                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1 block">
                      <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-[10px] uppercase font-bold text-red-500 mt-1 block" />
                      )}
                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1 block">
                      <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-[10px] uppercase font-bold text-red-500 mt-1 block" />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

             <Button
  type="submit"
  className="w-full py-3 rounded-none bg-primary border border-primary text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      <span>Signing in...</span>
    </>
  ) : (
    <>
      <span>Sign In</span>
      <ArrowRight className="w-4 h-4" />
    </>
  )}
</Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Not a member yet?{" "}
                <Link href="/sign-up" className="text-primary font-bold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-dashed border-border/20 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider font-bold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Login processes are secure and end-to-end encrypted.</span>
        </div>
      </footer>
    </div>
  );
}








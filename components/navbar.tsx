"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-none bg-primary flex items-center justify-center shadow-sm">
            <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            frankly<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-bold text-muted-foreground">
          <Link href="/#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#demo" className="hover:text-foreground transition-colors">
            Live Demo
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard Demo
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Link 
            href="/sign-in" 
            className="hidden sm:inline-block text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="relative px-4 py-2 rounded-none bg-primary border border-primary text-xs uppercase tracking-wider font-bold text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-200"
          >
            <span className="flex items-center gap-1 active:scale-95 transition-transform">
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

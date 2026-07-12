"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-none border border-transparent" />;
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    const doc = document as any;

    // Standard fallback if browser doesn't support View Transitions
    if (
      !doc.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            "polygon(100% 0, 100% 0, 100% 0, 100% 0)",
            "polygon(-50% 0, 100% 0, 100% 150%, 0 100%)",
          ],
        },
        {
          duration: 600,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center justify-center w-9 h-9 rounded-none border border-dashed border-border bg-card/40 backdrop-blur-md hover:bg-muted/80 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4">
        <Sun className="absolute inset-0 w-4 h-4 transition-all duration-300 dark:scale-0 dark:rotate-90 text-amber-500 scale-100 rotate-0" />
        <Moon className="absolute inset-0 w-4 h-4 transition-all duration-300 dark:scale-100 dark:rotate-0 text-primary scale-0 -rotate-90" />
      </div>
    </button>
  );
}

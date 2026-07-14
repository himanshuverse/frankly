"use client";

import { signOut } from "next-auth/react";

const Page = () => {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/sign-in",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <button
        onClick={handleSignOut}
        className="px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Page;
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
      type="button"
      disabled={isLoggingOut}
      onClick={logout}
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}

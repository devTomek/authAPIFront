"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button/Button";

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
    <Button
      variant="outline"
      className="py-2 text-sm"
      type="button"
      disabled={isLoggingOut}
      onClick={logout}
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </Button>
  );
}

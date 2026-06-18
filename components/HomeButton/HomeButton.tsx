"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";

export default function HomeButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="py-2 text-sm"
      type="button"
      onClick={() => router.push("/login")}
    >
      Home
    </Button>
  );
}

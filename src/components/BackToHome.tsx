"use client";

import { useRouter } from "next/navigation";

export default function BackToHome() {
  const router = useRouter();

  return (
    <div className="mb-6">
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
      >
        ← Back Home
      </button>
    </div>
  );
}

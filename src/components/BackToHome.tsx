"use client";

import { useRouter } from "next/navigation";

export default function BackToHome() {
  const router = useRouter();

  return (
    <div className="mt-1 inline-flex items-center">
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
      >
        ← Back Home
      </button>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorBanner() {
  const sp = useSearchParams();
  const err = sp.get("error");
  if (!err) return null;

  return (
    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
      {err}
    </div>
  );
}

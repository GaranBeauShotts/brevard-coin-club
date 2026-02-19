"use client";

import { useState } from "react";

export function ConfirmDeleteButton() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="grid gap-2">
      <div className="text-xs text-red-700">
        Are you sure? This is permanent.
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Yes, delete
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
      >
        Cancel
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import BackToHome from "@/components/BackToHome";

export default function JoinPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          message,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json?.error);
        setStatus("error");
        return;
      }

      setStatus("success");
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold">Join the Club</h1>
        <BackToHome />
      </div>

      <p className="mt-2 text-white/70">
        Interested in joining the Brevard Coin Club? Fill out the form below and we’ll review your request.
      </p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-3">Member Benefits</h2>
        <ul className="space-y-2 text-white/80 text-sm">
          <li>• Post and manage classified listings</li>
          <li>• Access private member-only content</li>
          <li>• Receive club newsletters</li>
          <li>• Early access to events and auctions</li>
        </ul>
      </div>
       <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
                <div className="text-sm uppercase tracking-wide text-yellow-300">
                    Membership
                </div>
    </div>


      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            className="mt-1 w-full rounded border border-white/10 bg-white/5 p-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={status === "loading"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded border border-white/10 bg-white/5 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Message (optional)</label>
          <textarea
            className="mt-1 w-full rounded border border-white/10 bg-white/5 p-2"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
        {status === "success" && (
          <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-300">
            ✅ Application received! A club admin will review your request.
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            Something went wrong. Please try again.
          </div>
        )}


      </form>
    </main>
  );
}

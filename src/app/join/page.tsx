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
  <main className="mx-auto max-w-3xl p-6 text-white min-h-screen">
  <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
    <h1 className="text-3xl font-bold">Join The Club</h1>
    <BackToHome />
  </div>

  <p className="mt-2 text-white/70">
    ...
  </p>

  {/* ✅ Stack sections with guaranteed spacing */}
  <section className="mt-8 space-y-6">
    {/* Membership card */}
    <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
      <div className="text-sm uppercase tracking-wide text-yellow-300">
        Membership
      </div>

      <div className="mt-2 text-3xl font-bold text-white">
        $30 <span className="text-lg font-medium text-white/70">/ year</span>
      </div>

      <p className="mt-3 text-sm text-white/80">
        Membership includes access to club meetings, special events, community classifieds,
        and updates throughout the year.
      </p>
    </div>

    {/* ✅ Form card */}
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold mb-4">Join Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
    </div>
  </section>
</main>
  );
} 
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NewsletterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const cleanedEmail = email.trim().toLowerCase();

    const { error } = await supabase.from("newsletter_subscribers").insert({
      full_name: fullName.trim() || null,
      email: cleanedEmail,
      source: "website",
    });

    if (error) {
      // If they already subscribed, Supabase will throw a unique constraint error.
      // We'll treat that as a friendly success.
      const msg = error.message.toLowerCase();
      if (msg.includes("duplicate") || msg.includes("unique")) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("success");
    setFullName("");
    setEmail("");
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold">Newsletter</h1>
      <p className="mt-2 text-white/80">
        Sign up for the monthly Newsletter.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/90">Name (optional)</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white placeholder:text-white/40"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Beau Shotts"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90">Email *</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white placeholder:text-white/40"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>

        {status === "success" && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-200">
            You’re subscribed! Thanks for joining the newsletter.
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">
            Something went wrong: {errorMsg}
          </div>
        )}
      </form>
    </main>
  );
}

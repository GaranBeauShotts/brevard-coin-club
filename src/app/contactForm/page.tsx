// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const payload = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim() || null,
      message: message.trim(),
      source: "website",
    };

    const { error } = await supabase.from("contact_messages").insert(payload);

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("success");
    setFullName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact the Club</h1>
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← Back to Home
        </Link>
      </div>

      <p className="mt-2 max-w-2xl text-sm text-white/70">
        Have a question about meetings, membership, or the club? Send a message and we’ll get back to you.
      </p>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/90">Full Name *</label>
              <input
                className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950/30 p-3 text-white placeholder:text-white/30 outline-none focus:border-white/30"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90">Email *</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950/30 p-3 text-white placeholder:text-white/30 outline-none focus:border-white/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">Subject (optional)</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950/30 p-3 text-white placeholder:text-white/30 outline-none focus:border-white/30"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Meeting info, membership, speaking request…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">Message *</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950/30 p-3 text-white placeholder:text-white/30 outline-none focus:border-white/30"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here…"
              required
            />
            <div className="mt-2 text-xs text-white/50">
              Please don’t include sensitive personal info. Coin values/messages are for educational purposes only.
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              ✅ Message sent! Thanks — we’ll reach out soon.
            </div>
          )}

          {status === "error" && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              ❌ Could not send: {errorMsg}
              <div className="mt-2 text-xs text-red-200/80">
                Tip: make sure the Supabase table <code className="px-1">contact_messages</code> exists and allows inserts.
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function JoinPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase
      .from("club_join_requests")
      .insert({
        full_name: fullName,
        email,
        message,
      });

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    setStatus("success");
    setFullName("");
    setEmail("");
    setMessage("");
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold">Join the Club</h1>
      <p className="mt-2 text-white-600">
        Interested in joining the Brevard Coin Club? Fill out the form below and we’ll contact you.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Message (optional)</label>
          <textarea
            className="mt-1 w-full rounded border p-2"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
          <p className="text-green-600">Thanks! Your request has been submitted.</p>
        )}

        {status === "error" && (
          <p className="text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </main>
  );
}

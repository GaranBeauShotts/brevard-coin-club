"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) return alert(error.message);

    router.push("/");
  }

  return (
  <main className="mx-auto max-w-6xl px-6 py-16">
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
      <h1 className="text-2xl font-bold mb-6 text-center text-zinc-100">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-400">
        Don’t have an account?{" "}
        <Link href="/register" className="text-white hover:underline font-medium">
          Create Account
        </Link>
      </div>
    </div>
  </main>
);

}

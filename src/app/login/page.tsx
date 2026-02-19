"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

export default function LoginPage() {
  const sp = useSearchParams();
  const err = sp.get("error");

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <h1 className="text-2xl font-bold mb-6 text-center text-zinc-100">Login</h1>

        {err && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20" required />
          <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20" required />
          <button type="submit" className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Don’t have an account?{" "}
          <Link href="/register" className="text-white hover:underline font-medium">
            Create Account
          </Link>
          <div className="mt-3">
            <Link href="/" className="h-9 inline-flex items-center justify-center rounded-xl border border-white/15 px-4 text-sm text-zinc-100 hover:bg-white/10 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

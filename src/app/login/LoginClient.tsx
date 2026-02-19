"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";
import ErrorBanner from "./error-banner";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const checkEmail = searchParams.get("check_email");
  const err = searchParams.get("error");

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <h1 className="text-2xl font-bold mb-6 text-center text-zinc-100">
          Login
        </h1>

        {checkEmail === "1" && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">
            Account created! Please check your email to confirm your account, then come back and sign in.
          </div>
        )}

        {err && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <ErrorBanner />

        <form action={loginAction} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required
            className="w-full rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <input name="password" type="password" placeholder="Password" required
            className="w-full rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button type="submit"
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Don’t have an account?{" "}
          <Link href="/register" className="text-white hover:underline font-medium">
            Create Account
          </Link>
          <div className="mt-3">
            <Link
              href="/"
              className="h-9 inline-flex items-center justify-center rounded-xl border border-white/15 px-4 text-sm text-zinc-100 hover:bg-white/10 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

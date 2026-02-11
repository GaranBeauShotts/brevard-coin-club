"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SiteHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const ghostBtn =
    "h-9 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-zinc-100 hover:bg-white/10 transition";
  const primaryBtn =
    "h-9 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition";
  const whiteBtn =
    "h-9 inline-flex items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg">
            🪙
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Brevard Coin Club</div>
            <div className="text-xs text-zinc-400">Community • Education • Events</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-200 md:flex">
          <Link className="hover:text-white" href="/events">
            Events
          </Link>
          <Link className="hover:text-white" href="/newsletter">
            Newsletter
          </Link>
          <Link className="hover:text-white" href="/classifieds">
            Classifieds
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/events" className={ghostBtn}>
            View Events
          </Link>

          {user ? (
            <>
              <Link href="/account" className={ghostBtn}>
                My Account
              </Link>

              <button onClick={handleLogout} className={whiteBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/join" className={ghostBtn}>
                Join the Club
              </Link>

              <Link href="/login" className={primaryBtn}>
                Login
              </Link>

              <Link href="/register" className={ghostBtn}>
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Classified = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  created_at?: string;
  user_id?: string | null;
};

function money(n: number) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
  } catch {
    return `$${(n || 0).toFixed(2)}`;
  }
}

export default function AccountPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [items, setItems] = useState<Classified[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function fetchMyListings(uid: string) {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("classifieds")
        .select("id,title,description,price,category,status,created_at,user_id")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data ?? []) as Classified[]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) fetchMyListings(userId);
    else setItems([]);
  }, [userId]);

  async function logout() {
    await supabase.auth.signOut();
    // optional redirect:
    window.location.href = "/";
  }

  if (!userId) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-bold">Account</h1>
          <p className="mt-2 text-white/70">You’re not logged in.</p>
          <Link
            href="/login"
            className="inline-block mt-6 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-white">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">👤 My Account</h1>
          <p className="mt-1 text-white/70">
            Signed in as <span className="text-white">{userEmail ?? "user"}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/classifieds"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            Go to Classifieds
          </Link>
          <button
            onClick={logout}
            className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Logout
          </button>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Listings</h2>
          <div className="text-sm text-white/60">{loading ? "Loading..." : `${items.length} total`}</div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-white/70">
            You haven’t posted any listings yet.{" "}
            <Link className="underline" href="/classifieds">
              Post one
            </Link>
            .
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">{item.title}</div>
                <span className="text-xs rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/70">
                  {item.status}
                </span>
              </div>

              <div className="mt-2 text-sm text-white/80 line-clamp-3">{item.description}</div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-yellow-200 font-semibold">{money(Number(item.price || 0))}</span>
                <span className="text-white/60">{item.category}</span>
              </div>

              {item.created_at && (
                <div className="mt-3 text-xs text-white/50">
                  Posted: {new Date(item.created_at).toLocaleString()}
                </div>
              )}

              <div className="mt-4">
                <Link
                  href="/classifieds"
                  className="text-sm underline text-white/90 hover:text-white"
                  title="Edit/delete from the classifieds page (owner controls are there)"
                >
                  Manage in Classifieds →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [preferredContact, setPreferredContact] = useState<"email" | "phone">("email");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cleanPhone(v: string) {
    return v.replace(/\D/g, "");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) Create auth user
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });

      if (signUpError) throw signUpError;

      // 2) OPTIONAL: store their entered profile info locally so /account can prefill
      // (Remove this block if you don’t want to store anything in the browser)
      const phoneDigits = phone.trim() ? cleanPhone(phone) : "";
      localStorage.setItem(
        "pending_profile",
        JSON.stringify({
          full_name: fullName.trim() || null,
          phone: phoneDigits || null,
          location: location.trim() || null,
          preferred_contact: preferredContact,
        })
      );

      // 3) Send them to login (or a “check your email” screen)
      router.push("/login?check_email=1");
    } catch (err: any) {
      setError(err?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="mt-2 text-sm text-white/70">
          Create your member login to post and manage classifieds.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/80">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
              placeholder="Your Name"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Location / Address</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
              placeholder="City, State"
              autoComplete="address-level2"
            />
            <p className="mt-1 text-xs text-white/50">
              Keep it general (city/state) if you don’t want to share your full address.
            </p>
          </div>

          <div>
            <label className="text-sm text-white/80">Phone (optional)</label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
              placeholder="(321) 555-1234"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Preferred Contact</label>
            <select
              value={preferredContact}
              onChange={(e) => setPreferredContact(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
            >
              <option value="email" className="bg-black">
                Email
              </option>
              <option value="phone" className="bg-black">
                Phone
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/80">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
            />
            <p className="mt-1 text-xs text-white/50">Minimum 6 characters.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">Already have an account?</p>
          <Link href="/login" className="inline-flex mt-2 text-blue-300 hover:text-white underline">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
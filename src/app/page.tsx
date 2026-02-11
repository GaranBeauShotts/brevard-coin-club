

import Link from "next/link";

import { supabase } from "@/lib/supabaseClient";
import FeatureCard from "@/components/FeatureCardd";



type EventRow = {
  id: string;
  title: string;
  location: string | null;
  start_time: string;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function HomePage() {
  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,location,start_time")
    .order("start_time", { ascending: true })
    .limit(3);

  const safeEvents: EventRow[] = (events ?? []) as EventRow[];

  return (
    <main className="min-h-screen bg-transparent text-zinc-100">

      {/* Header */}
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
            <Link href="/newsletter" className="hover:text-white">
            Newsletter
            </Link>
            <Link className="hover:text-white" href="#">
              Classifieds
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10"
            >
              View Events
            </Link>
            <Link
              href="/join"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Join the Club
            </Link>
            <Link
             href="/login"
               className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Login
            </Link>


          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Monthly meetings • Guest speakers • Shows
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              A local community for coin collectors in Brevard County.
            </h1>

            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              Discover upcoming meetings and coin shows, learn about collecting, and connect with
              other collectors. This site is the club’s official hub for events, newsletters, and
              member classifieds.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
              >
                See Upcoming Events
              </Link>
              <Link
                href="#about"
                className="rounded-xl border border-white/15 px-5 py-3 text-sm text-zinc-100 hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
        
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">1×</div>
                <div className="mt-1 text-xs text-zinc-400">Monthly meeting</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">Local</div>
                <div className="mt-1 text-xs text-zinc-400">Brevard County</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">Safe</div>
                <div className="mt-1 text-xs text-zinc-400">Moderated community</div>
              </div>
            </div>
          </div>
          
          {/* Hero card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Next Up</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Here are the next upcoming events pulled from the club calendar.
                </p>
              </div>
              <Link
                href="/events"
                className="rounded-xl border border-white/15 px-3 py-2 text-xs text-zinc-100 hover:bg-white/10"
              >
                View all →
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  Could not load events: {error.message}
                </div>
              )}

              {safeEvents.map((e) => (
                <div key={e.id} className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
                  <div className="text-sm font-semibold">{e.title}</div>
                  <div className="mt-1 text-xs text-zinc-400">{e.location ?? "TBA"}</div>
                  <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                    {formatDateTime(e.start_time)}
                  </div>
                </div>
              ))}

              {safeEvents.length === 0 && !error && (
                <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4 text-sm text-zinc-300">
                  No events yet. Add one in Supabase and it will show up here.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Single image (no card), smaller and right-aligned */}
      <div className="flex justify-center px-6 pb-10">
      <div className="overflow-hidden rounded-3xl w-full max-w-4xl">
        <img
          src="/gallery/gold_us.png"
          alt="Brevard Coin Club meeting"
           className="h-48 md:h-56 w-full object-cover"
          loading="lazy"
        />
      </div>
      </div>

      {/* Features */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-bold">Everything in one place</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          We’re building a central home for club announcements, educational resources, and a safe
          place for members to connect.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Events & Shows"
            desc="Calendar-style listings with meeting details, locations, and schedules."
            href="/events"
            emoji="📅"
          />
          <FeatureCard
            title="Newsletters"
            desc="Open the current club newsletter (PDF)."
            href="/newsletters/February_2026.pdf"
            emoji="📰"
          />
          <FeatureCard
            title="Coin Value Helper"
            desc="An educational estimator with trusted references and disclaimers."
            href="#"
            emoji="🧭"
          />
          <FeatureCard
            title="Classifieds"
            desc="Moderated buy/sell/trade listings for members and local collectors."
            href="/classifieds"
            emoji="🏷️"
/>
        </div>
      </section>
             
      {/* Join */}
      <section id="join" className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
          <h2 className="text-2xl font-bold">Join the Brevard Coin Club</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            Interested in attending a meeting? Bring a friend, ask questions, and learn from other
            collectors. This site will soon include a newsletter signup and member tools.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Find the Next Meeting
            </Link>
            <Link
              href="/contactForm"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm text-zinc-100 hover:bg-white/10"
            >
              Contact the Club
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            * Coin values on this site are informational only and not formal appraisals.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Brevard Coin Club</div>
          <div className="flex gap-4">
            <Link className="hover:text-white" href="/events">
              Events
            </Link>
            <Link className="hover:text-white" href="#">
              Privacy
            </Link>
            <Link className="hover:text-white" href="#">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}




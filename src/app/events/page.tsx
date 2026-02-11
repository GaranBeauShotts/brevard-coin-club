import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
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

export default async function EventsPage() {
  const { data, error } = await supabase
    .from("events")
    .select("id,title,description,location,start_time,end_time")
    .order("start_time", { ascending: true });

  const events = (data ?? []) as EventRow[];

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Upcoming Events</h1>
          <Link
            href="/"
            className="h-9 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            ← Back home
          </Link>

        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            Could not load events: {error.message}
          </div>
        )}

        {!error && events.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            No events yet.
          </div>
        )}

        <div className="space-y-4">
          {events.map((e) => (
            <div key={e.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-lg font-semibold">{e.title}</div>
              <div className="mt-1 text-sm text-zinc-400">{e.location ?? "TBA"}</div>
              <div className="mt-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-200">
                {formatDateTime(e.start_time)}
              </div>
              {e.description && (
                <p className="mt-3 text-sm text-zinc-300">{e.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

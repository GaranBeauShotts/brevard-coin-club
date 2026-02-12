"use client";

import { useEffect, useState } from "react";


type Metal = {
    name: string;
    symbol: string;
    price: number;
    updatedAt: string;
    updatedAtReadable?: string;
};

type MetalsResponse = {
    gold: Metal;
    silver: Metal;
    fetchedAt: string;
};

function money(n: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(n);
}

export default function MetalsTicker() {
    const [data, setData] = useState<MetalsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/metals", { cache: "no-store" });
            const text = await res.text();

            let json: any;
            try {
                json = JSON.parse(text);
            } catch {
                throw new Error(`Ticker endpoint did not return JSON (status ${res.status})`);
            }

            if (!res.ok) throw new Error(json?.error || "Failed to load metals");
            setData(json);

            if (!res.ok) throw new Error(json?.error || "Failed to load metals");
            setData(json);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load metals");
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        const t = setInterval(load, 60_000); // refresh each minute
        return () => clearInterval(t);
    }, []);

   return (
  <div className="w-full border-b border-white/10 bg-zinc-900/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-sm">

      {data && !loading && !error ? (
        <>
          {/* Left side */}
          <div className="flex items-center gap-6">

            {/* Gold */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-yellow-300">Gold (XAU|USD)</span>
              <span className="font-semibold">
                {money(data.gold.price)}
              </span>
            </div>

            {/* Divider */}
            <span className="text-white/20">|</span>

            {/* Silver */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-300">Silver (XAG|USD)</span>
              <span className="font-semibold">
                {money(data.silver.price)}
              </span>
            </div>

          </div>

          {/* Right side */}
          <div className="text-xs text-white/50">
            Updated {data.gold.updatedAtReadable ?? new Date(data.gold.updatedAt).toLocaleTimeString()}
          </div>
        </>
      ) : (
        <div className="text-white/60">
          {loading ? "Loading spot prices…" : error ?? "Spot unavailable"}
        </div>
      )}

    </div>
  </div>
);

}

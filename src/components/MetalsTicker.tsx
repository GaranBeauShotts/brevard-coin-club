"use client";

import { useEffect, useRef, useState } from "react";

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

function deltaText(curr?: number, prev?: number) {
  if (curr == null || prev == null) return null;
  const d = curr - prev;
  const sign = d > 0 ? "+" : d < 0 ? "−" : "";
  return `${sign}$${Math.abs(d).toFixed(2)}`;
}

function dir(curr?: number, prev?: number) {
  if (curr == null || prev == null) return "none";
  if (curr > prev) return "up";
  if (curr < prev) return "down";
  return "flat";
}

function arrowClass(d: string) {
  return d === "up"
    ? "text-green-400"
    : d === "down"
      ? "text-red-400"
      : "text-white/40";
}

// No arrow on first load / flat
function arrowChar(d: string) {
  return d === "up" ? "▲" : d === "down" ? "▼" : "";
}

export default function MetalsTicker() {
  
  const [data, setData] = useState<MetalsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef<{ gold?: number; silver?: number } | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/metals", { cache: "no-store" });
      const text = await res.text();

      let json: MetalsResponse;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(
          `Ticker endpoint did not return JSON (status ${res.status})`
        );
      }

      if (!res.ok) throw new Error((json as any)?.error || "Failed to load metals");

      // ✅ update prevRef using prev state (avoids stale closure)
      setData((prevData) => {
        if (prevData) {
          prevRef.current = {
            gold: prevData.gold.price,
            silver: prevData.silver.price,
          };
        }
        return json;
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to load metals");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = prevRef.current;
  const goldDir = dir(data?.gold?.price, prev?.gold);
  const silverDir = dir(data?.silver?.price, prev?.silver);
  const goldDelta = deltaText(data?.gold?.price, prev?.gold);
  const silverDelta = deltaText(data?.silver?.price, prev?.silver);

  return (
    <div className="w-full border-b border-white/10 bg-zinc-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-sm">
        {data && !loading && !error ? (
          <>
            <div className="flex items-center gap-6">
              {/* Gold */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-yellow-300">
                  Gold (XAU|USD)
                </span>

                <span className={`font-semibold ${arrowClass(goldDir)}`}>
                  {arrowChar(goldDir)}
                  {goldDelta ? ` ${goldDelta}` : ""}
                </span>

                <span className="font-semibold">{money(data.gold.price)}</span>
              </div>

              <span className="text-white/20">|</span>

              {/* Silver */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-300">
                  Silver (XAG|USD)
                </span>

                <span className={`font-semibold ${arrowClass(silverDir)}`}>
                  {arrowChar(silverDir)}
                  {silverDelta ? ` ${silverDelta}` : ""}
                </span>

                <span className="font-semibold">{money(data.silver.price)}</span>
              </div>
            </div>

            <div className="text-xs text-white/50">
              Updated{" "}
              {data.gold.updatedAtReadable ??
                new Date(data.gold.updatedAt).toLocaleTimeString()}
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

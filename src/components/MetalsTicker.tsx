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
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">The Current State of our Metals</div>
                    <span className="text-xs text-white/50">Gold & Silver</span>
                </div>

                <button
                    onClick={load}
                    className="h-9 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10 transition"
                >
                    Refresh
                </button>
            </div>

            {loading && (
                <div className="mt-3 text-sm text-white/70">Loading prices…</div>
            )}

            {error && !loading && (
                <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {error}
                </div>
            )}

            {data && !loading && !error && (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">🥇 Gold (XAU)</div>
                            <div className="text-sm font-semibold text-yellow-200">
                                {money(data.gold.price)}
                            </div>
                        </div>
                        <div className="mt-1 text-xs text-white/50">
                            Updated: {new Date(data.gold.updatedAt).toLocaleString()}
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">🥈 Silver (XAG)</div>
                            <div className="text-sm font-semibold text-zinc-200">
                                {money(data.silver.price)}
                            </div>
                        </div>
                        <div className="mt-1 text-xs text-white/50">
                            Updated: {new Date(data.silver.updatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";

type AiResult = {
  summary: string;
  key_value_drivers: string[];
  risk_flags: { severity: "low" | "medium" | "high"; message: string }[];
};

export default function CoinPage() {
  const [year, setYear] = useState("");
  const [country, setCountry] = useState("");
  const [denomination, setDenomination] = useState("");
  const [grade, setGrade] = useState("Raw");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<AiResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAi(null);

    // Fake valuation numbers for now (MVP)
    const payload = {
      coin: { country, denomination, year, grade },
      valuation: {
        auction_value: 110,
        retail_value: 145,
        insurance_value: 180,
        confidence: "medium",
        melt_value: null,
      },
    };

    try {
      const res = await fetch("/api/coin/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Request failed");
        console.error("Explain error:", data);
        return;
      }

      setAi(data);
    } catch (err: any) {
      setError(err?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Coin Value Helper</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States"
            className="w-full rounded border border-white/20 bg-zinc-900 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Denomination</label>
          <input
            value={denomination}
            onChange={(e) => setDenomination(e.target.value)}
            placeholder="Dollar, Cent, Real, Peso"
            className="w-full rounded border border-white/20 bg-zinc-900 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="1881"
            className="w-full rounded border border-white/20 bg-zinc-900 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Grade</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded border border-white/20 bg-zinc-900 p-2"
          >
            <option>Raw</option>
            <option>VG</option>
            <option>F</option>
            <option>VF</option>
            <option>XF</option>
            <option>AU</option>
            <option>MS60</option>
            <option>MS63</option>
            <option>MS65</option>
            <option>Details / Problem</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400 disabled:opacity-60"
        >
          {loading ? "Explaining..." : "Get Value Estimate"}
        </button>
      </form>

      <div className="mt-6">
        {error && (
          <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {ai && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
            <div className="text-sm font-semibold">AI Summary</div>
            <p className="mt-2 text-sm text-white/80">{ai.summary}</p>

            <div className="mt-4 text-sm font-semibold">Key value drivers</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/80">
              {ai.key_value_drivers?.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>

            {ai.risk_flags?.length > 0 && (
              <>
                <div className="mt-4 text-sm font-semibold">Risk flags</div>
                <ul className="mt-2 space-y-2">
                  {ai.risk_flags.map((r, i) => (
                    <li
                      key={i}
                      className="rounded border border-white/10 bg-white/5 p-2 text-sm text-white/80"
                    >
                      <span className="font-semibold">{r.severity.toUpperCase()}:</span>{" "}
                      {r.message}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

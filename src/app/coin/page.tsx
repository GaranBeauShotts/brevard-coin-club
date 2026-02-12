"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AiResult = {
  summary: string;
  key_value_drivers: string[];
  risk_flags: { severity: "low" | "medium" | "high"; message: string }[];
};

type CompsResult = {
  query: string;
  url: string;
  count: number;
  median: number;
  average: number;
  low: number;
  high: number;
  trimmed?: {
    count: number;
    median: number;
    average: number;
    low: number;
    high: number;
  };
};

function buildCompQuery(input: {
  year: string;
  country: string;
  denomination: string;
  grade: string;
}) {
  const { year, country, denomination, grade } = input;

  const parts: string[] = [];
  if (year.trim()) parts.push(year.trim());
  if (denomination.trim()) parts.push(denomination.trim());
  if (grade && grade !== "Raw") parts.push(grade.trim());
  if (country.trim() && country.trim().toLowerCase() !== "united states") {
    parts.push(country.trim());
  }

  return parts.join(" ").trim();
}

function openEbaySoldComps(searchPhrase: string) {
  const url =
    "https://www.ebay.com/sch/i.html?_nkw=" +
    encodeURIComponent(searchPhrase) +
    "&LH_Sold=1&LH_Complete=1";

  window.open(url, "_blank", "noopener,noreferrer");
}

export default function CoinPage() {
  const [year, setYear] = useState("");
  const [country, setCountry] = useState("");
  const [denomination, setDenomination] = useState("");
  const [grade, setGrade] = useState("Raw");

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<AiResult | null>(null);

  // ✅ comps state belongs here (top-level)
  const [comps, setComps] = useState<CompsResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAi(null);
    setComps(null);

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

    const compPhrase = buildCompQuery({ year, country, denomination, grade });

    try {
      // 1) Explain
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

      // 2) Comps
      if (compPhrase) {
        const compRes = await fetch("/api/coin/comps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: compPhrase }),
        });

        const text = await compRes.text();
        let compData: any = null;

        try {
          compData = text ? JSON.parse(text) : null;
        } catch {
          compData = { error: "Non-JSON response from /api/coin/comps", raw: text?.slice(0, 200) };
        }

        if (!compRes.ok) {
          console.warn("Comps error:", compRes.status, compData);
        } else {
          setComps(compData);
        }


        if (!compRes.ok) {
          console.warn("Comps error:", compData);
        } else {
          setComps(compData);
        }

        // 3) Optional open eBay tab
        openEbaySoldComps(compPhrase);
      }
    } catch (err: any) {
      setError(err?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Coin Value Analyzer</h1>

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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400 disabled:opacity-60"
          >
            {loading ? "Explaining..." : "Get Value Estimate"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded border border-white/20 bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20 transition"
          >
            Back Home
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
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

        {comps && (
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="text-sm font-semibold text-blue-200">Market Comps (eBay sold)</div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-white/80">
              <div>
                Count: <span className="font-semibold">{comps.count}</span>
              </div>
              <div>
                Median: <span className="font-semibold">${comps.median.toFixed(2)}</span>
              </div>
              <div>
                Avg: <span className="font-semibold">${comps.average.toFixed(2)}</span>
              </div>
              <div>
                Range:{" "}
                <span className="font-semibold">
                  ${comps.low.toFixed(2)}–${comps.high.toFixed(2)}
                </span>
              </div>
            </div>

            {comps.trimmed && (
              <>
                <div className="mt-3 text-xs text-white/60">Trimmed (drops outliers)</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-white/80">
                  <div>
                    Count: <span className="font-semibold">{comps.trimmed.count}</span>
                  </div>
                  <div>
                    Median: <span className="font-semibold">${comps.trimmed.median.toFixed(2)}</span>
                  </div>
                  <div>
                    Avg: <span className="font-semibold">${comps.trimmed.average.toFixed(2)}</span>
                  </div>
                  <div>
                    Range:{" "}
                    <span className="font-semibold">
                      ${comps.trimmed.low.toFixed(2)}–${comps.trimmed.high.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}

            <a
              href={comps.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-blue-200 underline hover:text-blue-100"
            >
              View sold comps on eBay →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

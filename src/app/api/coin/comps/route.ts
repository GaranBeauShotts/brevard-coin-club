import { NextResponse } from "next/server";

function median(nums: number[]) {
  const n = nums.length;
  if (n === 0) return null;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
}

function trimmed(nums: number[], trimPct = 0.15) {
  if (nums.length < 8) return nums;
  const n = nums.length;
  const cut = Math.floor(n * trimPct);
  return nums.slice(cut, n - cut);
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const url =
      "https://www.ebay.com/sch/i.html?_nkw=" +
      encodeURIComponent(query.trim()) +
      "&LH_Sold=1&LH_Complete=1";

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
      redirect: "follow",
    });

    // ✅ Always return JSON if eBay blocks / errors
    if (!res.ok) {
      return NextResponse.json(
        { error: "eBay fetch failed", status: res.status },
        { status: 502 }
      );
    }

    const html = await res.text();

    const priceRegex = /\$([\d,]+\.\d{2})/g;
    const matches = [...html.matchAll(priceRegex)];

    const prices = matches
      .map((m) => parseFloat(m[1].replace(/,/g, "")))
      .filter((n) => Number.isFinite(n))
      .filter((n) => n >= 5 && n <= 100000)
      .sort((a, b) => a - b);

    if (prices.length === 0) {
      return NextResponse.json(
        { error: "No prices found (blocked or no comps)" },
        { status: 400 }
      );
    }

    const rawMedian = median(prices);
    const rawAvg = prices.reduce((s, x) => s + x, 0) / prices.length;

    const t = trimmed(prices, 0.15);
    const tMedian = median(t);
    const tAvg = t.reduce((s, x) => s + x, 0) / t.length;

    return NextResponse.json({
      query: query.trim(),
      url,
      count: prices.length,
      median: rawMedian,
      average: rawAvg,
      low: prices[0],
      high: prices[prices.length - 1],
      trimmed: {
        count: t.length,
        median: tMedian,
        average: tAvg,
        low: t[0],
        high: t[t.length - 1],
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

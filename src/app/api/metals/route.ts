import { NextResponse } from "next/server";

export const revalidate = 60; // cache for 60s (Vercel-friendly)

type GoldApiResponse = {
  name: string;
  symbol: string;
  price: number;
  updatedAt: string;
  updatedAtReadable?: string;
};

async function getMetal(symbol: "XAU" | "XAG") {
  const res = await fetch(`https://api.gold-api.com/price/${symbol}`, {
    // Ensure caching works in Next app router
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Failed to fetch ${symbol} price`);
  return (await res.json()) as GoldApiResponse;
}

export async function GET() {
  try {
    const [gold, silver] = await Promise.all([getMetal("XAU"), getMetal("XAG")]);

    return NextResponse.json({
      gold,
      silver,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load metals ticker" },
      { status: 500 }
    );
  }
}

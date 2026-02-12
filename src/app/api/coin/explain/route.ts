import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const coin = body?.coin;
    const valuation = body?.valuation;

    if (!coin?.country || !coin?.denomination || !coin?.year || !coin?.grade) {
      return NextResponse.json(
        { error: "Missing coin fields (country, denomination, year, grade)" },
        { status: 400 }
      );
    }

    if (
      valuation?.auction_value == null ||
      valuation?.retail_value == null ||
      valuation?.insurance_value == null ||
      !valuation?.confidence
    ) {
      return NextResponse.json(
        { error: "Missing valuation fields" },
        { status: 400 }
      );
    }

    const { country, denomination, year, grade } = coin;

    // MVP “AI” response (you can later swap this to OpenAI or a rules engine)
    const summary = `Estimated values for a ${year} ${country} ${denomination} (${grade}). Auction vs retail vs insurance can vary based on eye appeal, originality, and demand.`;

    const key_value_drivers = [
      "Date/mint and rarity (key dates matter most).",
      "Grade and surface preservation (wear, marks, luster).",
      "Originality (cleaning, tooling, damage lowers value).",
      "Eye appeal (toning, strike, color).",
      "Market demand and recent sold comps.",
    ];

    const risk_flags = [
      ...(grade.toLowerCase().includes("details")
        ? [{ severity: "high" as const, message: "Details/problem coins can sell far below straight-grade examples." }]
        : []),
    ];

    return NextResponse.json({
      summary,
      key_value_drivers,
      risk_flags,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

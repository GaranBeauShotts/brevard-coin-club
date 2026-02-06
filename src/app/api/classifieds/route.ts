import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() || "";

    let query = supabase
      .from("classifieds")
      .select("*")
      .order("created_at", { ascending: false });

    // Optional search: /api/classifieds?q=morgan
    if (q) {
      // Searches title OR description (Postgres "or" syntax)
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = body?.title;
    const description = body?.description;
    const price = body?.price ?? 0;
    const category = body?.category ?? "General";
    const status = body?.status ?? "active";
    const contact_email = body?.contact_email ?? null;

    // Basic validation (rubric)
    if (!isNonEmptyString(title) || !isNonEmptyString(description)) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a number >= 0." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("classifieds")
      .insert([
        {
          title: String(title).trim(),
          description: String(description).trim(),
          price: numericPrice,
          category: String(category),
          status: String(status),
          contact_email: contact_email ? String(contact_email) : null,
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

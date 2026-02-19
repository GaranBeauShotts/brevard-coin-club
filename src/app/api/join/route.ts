import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const full_name = body?.full_name;
    const email = body?.email;
    const message = body?.message ?? "";

    if (!isNonEmptyString(full_name) || !isNonEmptyString(email)) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("club_join_requests").insert({
      full_name: String(full_name).trim(),
      email: String(email).trim(),
      message: String(message).trim() || null,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, details: (error as any).details },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

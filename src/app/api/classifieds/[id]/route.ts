import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("classifieds")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const update: any = {};

    if (body?.title !== undefined) {
      if (!isNonEmptyString(body.title)) {
        return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
      }
      update.title = String(body.title).trim();
    }

    if (body?.description !== undefined) {
      if (!isNonEmptyString(body.description)) {
        return NextResponse.json({ error: "Description cannot be empty." }, { status: 400 });
      }
      update.description = String(body.description).trim();
    }

    if (body?.price !== undefined) {
      const p = Number(body.price);
      if (Number.isNaN(p) || p < 0) {
        return NextResponse.json({ error: "Price must be a number >= 0." }, { status: 400 });
      }
      update.price = p;
    }

    if (body?.category !== undefined) update.category = String(body.category);
    if (body?.status !== undefined) update.status = String(body.status);
    if (body?.contact_email !== undefined)
      update.contact_email = body.contact_email ? String(body.contact_email) : null;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("classifieds")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("classifieds")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: true, record: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

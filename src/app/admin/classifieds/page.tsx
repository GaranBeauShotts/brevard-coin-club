import { requireAdmin } from "@/lib/requireAdmin";

import { revalidatePath } from "next/cache";
import { ConfirmDeleteButton } from "./actions"

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function statusPill(status: string) {
  const s = (status || "").toLowerCase();
  const isInactive = s === "inactive";
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        isInactive
          ? "bg-zinc-100 text-zinc-700 ring-zinc-200"
          : "bg-emerald-50 text-emerald-700 ring-emerald-200"
      )}
    >
      {isInactive ? "Inactive" : "Active"}
    </span>
  );
}

async function deleteClassified(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("classifieds").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/classifieds");
}

async function setStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "active");
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("classifieds").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/classifieds");
}

type SearchParams = {
  q?: string;
  status?: string; // "all" | "active" | "inactive"
};

export default async function AdminClassifiedsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { supabase, user } = await requireAdmin();

  const q = (searchParams?.q || "").trim();
  const status = (searchParams?.status || "all").toLowerCase();

  let query = supabase
    .from("classifieds")
    .select("id, title, description, price, category, status, contact_email, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status === "active") query = query.eq("status", "active");
  if (status === "inactive") query = query.eq("status", "inactive");

  if (q) {
    // Search across a few useful fields
    query = query.or(
      `title.ilike.%${q}%,description.ilike.%${q}%,contact_email.ilike.%${q}%`
    );
  }

  const { data: classifieds, error } = await query;

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-bold text-red-900">Moderate Classifieds</h2>
          <p className="mt-2 text-sm text-red-800">Failed to load: {error.message}</p>
        </div>
      </div>
    );
  }

  const total = classifieds?.length ?? 0;
  const activeCount = (classifieds ?? []).filter((c) => (c.status || "").toLowerCase() !== "inactive").length;
  const inactiveCount = total - activeCount;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                Moderate Classifieds
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                Logged in as <span className="font-semibold">{user.email}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <div className="rounded-xl border bg-white px-3 py-2 text-sm">
                <span className="text-zinc-500">Total</span>{" "}
                <span className="font-bold text-zinc-900">{total}</span>
              </div>
              <div className="rounded-xl border bg-white px-3 py-2 text-sm">
                <span className="text-zinc-500">Active</span>{" "}
                <span className="font-bold text-zinc-900">{activeCount}</span>
              </div>
              <div className="rounded-xl border bg-white px-3 py-2 text-sm">
                <span className="text-zinc-500">Inactive</span>{" "}
                <span className="font-bold text-zinc-900">{inactiveCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <form
          className="mb-6 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-12"
          action="/admin/classifieds"
          method="get"
        >
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-zinc-700">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search title, description, or email…"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-zinc-700">Status</label>
            <select
              name="status"
              defaultValue={status}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Go
            </button>
          </div>
        </form>

        {/* List */}
        {!classifieds?.length ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">
            No classifieds found.
          </div>
        ) : (
          <div className="grid gap-4">
            {classifieds.map((c) => (
              <div key={c.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-zinc-900">{c.title}</h2>

                      {statusPill(c.status)}

                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                        {c.category}
                      </span>

                      <span className="ml-1 text-sm font-semibold text-zinc-900">
                        ${Number(c.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-zinc-600">
                      {new Date(c.created_at).toLocaleString()}
                      {c.contact_email ? ` • ${c.contact_email}` : ""}
                      {c.user_id ? ` • user: ${c.user_id}` : ""}
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-800">
                      {c.description}
                    </p>
                  </div>

                  <div className="w-full md:w-56">
                    <div className="grid gap-2">
                      {/* Soft action */}
                      {String(c.status).toLowerCase() !== "inactive" ? (
                        <form action={setStatus}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="status" value="inactive" />
                          <button
                            type="submit"
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                          >
                            Deactivate
                          </button>
                        </form>
                      ) : (
                        <form action={setStatus}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="status" value="active" />
                          <button
                            type="submit"
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                          >
                            Reactivate
                          </button>
                        </form>
                      )}

                      {/* Hard delete w/ confirmation */}
                      <form action={deleteClassified}>
                        <input type="hidden" name="id" value={c.id} />
                        <ConfirmDeleteButton />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center text-xs text-zinc-500">
          Showing newest first (max 200). Deactivate = soft remove. Delete = permanent.
        </div>
      </div>
    </div>
  );
}

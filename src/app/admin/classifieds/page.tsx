import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePath } from "next/cache";
import { ConfirmDeleteButton } from "./actions";

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
          ? "bg-zinc-800 text-zinc-400 ring-zinc-700"
          : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
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
    query = query.or(
      `title.ilike.%${q}%,description.ilike.%${q}%,contact_email.ilike.%${q}%`
    );
  }

  const { data: classifieds, error } = await query;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-zinc-100">
        <div className="mx-auto max-w-6xl p-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <h2 className="text-lg font-bold text-red-200">Moderate Classifieds</h2>
            <p className="mt-2 text-sm text-red-200/80">Failed to load: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const total = classifieds?.length ?? 0;
  const activeCount = (classifieds ?? []).filter(
    (c) => (c.status || "").toLowerCase() !== "inactive"
  ).length;
  const inactiveCount = total - activeCount;

  return (
    <div className="min-h-screen bg-transparent text-zinc-100">



      <div className="mx-auto max-w-6xl p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">
                Moderate Classifieds
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Logged in as <span className="font-semibold text-zinc-200">{user.email}</span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm px-4 py-3 text-sm">
                <span className="text-zinc-400">Total</span>{" "}
                <span className="ml-1 font-bold text-zinc-100">{total}</span>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm">
                <span className="text-emerald-400">Active</span>{" "}
                <span className="ml-1 font-bold text-emerald-300">{activeCount}</span>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm">
                <span className="text-zinc-400">Inactive</span>{" "}
                <span className="ml-1 font-bold text-zinc-200">{inactiveCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <form
          className="mb-6 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-5 md:grid-cols-12"
          action="/admin/classifieds"
          method="get"
        >
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-zinc-300">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search title, description, or email…"
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-zinc-300">Status</label>
            <select
              name="status"
              defaultValue={status}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-500/60"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Go
            </button>
          </div>
        </form>

        {/* List */}
        {!classifieds?.length ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-6 text-sm text-zinc-400">
            No classifieds found.
          </div>
        ) : (
          <div className="grid gap-4">
            {classifieds.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-6 shadow-xl transition hover:border-zinc-700"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-zinc-100">{c.title}</h2>

                      {statusPill(c.status)}

                      <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 ring-1 ring-zinc-700">
                        {c.category}
                      </span>

                      <span className="ml-1 text-sm font-semibold text-emerald-400">
                        ${Number(c.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-zinc-400">
                      {new Date(c.created_at).toLocaleString()}
                      {c.contact_email ? ` • ${c.contact_email}` : ""}
                      {c.user_id ? ` • user: ${c.user_id}` : ""}
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-300">
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
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-700"
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
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-700"
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

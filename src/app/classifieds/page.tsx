"use client";
import Link from "next/link";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Metadata } from "next";




type Classified = {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    status: "active" | "sold" | "archived" | string;
    contact_email?: string | null;
    created_at?: string;
    updated_at?: string;
    user_id?: string | null;
};

const CATEGORIES = ["Coins", "Bullion", "Supplies", "Books", "Wanted", "General"] as const;
const STATUSES = ["active", "sold", "archived"] as const;

function money(n: number) {
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
    } catch {
        return `$${(n || 0).toFixed(2)}`;
    }
}

export default function ClassifiedsPage() {
    const [items, setItems] = useState<Classified[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // auth
    const [userId, setUserId] = useState<string | null>(null);

    // Search + filter
    const [q, setQ] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | (typeof STATUSES)[number]>("all");

    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<string>("0");
    const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Coins");
    const [status, setStatus] = useState<(typeof STATUSES)[number]>("active");
    const [contactEmail, setContactEmail] = useState("");

    useEffect(() => {
        // initial user
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id ?? null);
        });

        // update user on auth changes
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            const id = session?.user?.id ?? null;
            setUserId(id);

            if (!id) {
                setEditingId(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        return () => sub.subscription.unsubscribe();
    }, []);


    async function fetchItems(search?: string) {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from("classifieds")
                .select("id,title,description,price,category,status,contact_email,created_at,updated_at,user_id")
                .order("created_at", { ascending: false });

            if (search && search.trim()) {
                const needle = `%${search.trim()}%`;
                query = query.or(`title.ilike.${needle},description.ilike.${needle},category.ilike.${needle}`);
            }

            const { data, error } = await query;
            if (error) throw error;

            setItems((data ?? []) as Classified[]);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load classifieds.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    function resetForm() {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setPrice("0");
        setCategory("Coins");
        setStatus("active");
        setContactEmail("");
    }

    function startEdit(item: Classified) {
        setEditingId(item.id);
        setTitle(item.title ?? "");
        setDescription(item.description ?? "");
        setPrice(String(item.price ?? 0));
        setCategory((item.category as any) ?? "Coins");
        setStatus((item.status as any) ?? "active");
        setContactEmail(item.contact_email ?? "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { data: userRes, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;

            const user = userRes.user;
            if (!user) throw new Error("You must be logged in to post or edit listings.");

            const basePayload = {
                title,
                description,
                price: Number(price),
                category,
                status,
                contact_email: contactEmail.trim() ? contactEmail.trim() : null,
            };

            const isEdit = Boolean(editingId);

            if (isEdit) {
                const { error } = await supabase.from("classifieds").update(basePayload).eq("id", editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("classifieds").insert({
                    ...basePayload,
                    user_id: user.id, // required for RLS insert policy
                });
                if (error) throw error;
            }

            await fetchItems(q);
            resetForm();
        } catch (e: any) {
            setError(e?.message ?? "Save failed.");
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(id: string) {
        const ok = window.confirm("Are you sure you want to delete this listing?");
        if (!ok) return;

        setError(null);
        try {
            const { data: userRes, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;
            if (!userRes.user) throw new Error("You must be logged in to delete listings.");

            const { error } = await supabase.from("classifieds").delete().eq("id", id);
            if (error) throw error;

            await fetchItems(q);
            if (editingId === id) resetForm();
        } catch (e: any) {
            setError(e?.message ?? "Delete failed.");
        }
    }

    const filtered = useMemo(() => {
        let list = items;

        if (statusFilter !== "all") {
            list = list.filter((x) => (x.status ?? "active") === statusFilter);
        }

        if (q.trim()) {
            const needle = q.trim().toLowerCase();
            list = list.filter(
                (x) =>
                    (x.title ?? "").toLowerCase().includes(needle) ||
                    (x.description ?? "").toLowerCase().includes(needle) ||
                    (x.category ?? "").toLowerCase().includes(needle)
            );
        }

        return list;
    }, [items, q, statusFilter]);

    return (
        <main className="mx-auto max-w-6xl p-4 md:p-8 text-white">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">🏷️ Classifieds</h1>
                    <p className="mt-1 text-white/70">
                        Browse listings. Logged-in users can post. Only owners can edit/delete.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm flex items-center justify-center hover:bg-white/10 transition"
                    >
                        ← Home
                    </Link>

                    <button
                        onClick={() => fetchItems(q)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm flex items-center justify-center hover:bg-white/10 transition"
                    >
                        Refresh
                    </button>

                </div>
            </div>

            {/* Form (only visible if logged in) */}
            {userId ? (
                <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">{editingId ? "Edit Listing" : "Create Listing"}</h2>
                        {editingId && (
                            <span className="text-xs text-yellow-200/90 rounded-full border border-yellow-200/20 bg-yellow-200/10 px-3 py-1">
                                Editing
                            </span>
                        )}
                    </div>

                    <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-sm text-white/80">Title *</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Example: 1881 Morgan Dollar - Toned"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm text-white/80">Description *</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Condition, provenance, pickup/shipping notes, etc."
                                className="mt-1 w-full min-h-[110px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/80">Price</label>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                inputMode="decimal"
                                placeholder="0"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                                disabled={saving}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/80">Contact Email (optional)</label>
                            <input
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                                disabled={saving}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/80">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                                disabled={saving}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c} className="bg-black">
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-white/80">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-white/20"
                                disabled={saving}
                            >
                                {STATUSES.map((s) => (
                                    <option key={s} value={s} className="bg-black">
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
                            <div className="text-xs text-white/60">
                                Required fields: Title, Description. Only the owner can edit/delete.
                            </div>

                            <div className="flex gap-2">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-60 transition"
                                >
                                    {saving ? "Saving..." : editingId ? "Save Changes" : "Post Listing"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}
                </section>
            ) : (
                <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
                    <h2 className="text-lg font-semibold">Create Listing</h2>
                    <div className="mt-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">
                        You must be logged in to post listings.{" "}
                        <Link className="underline" href="/login">
                            Log in
                        </Link>
                    </div>
                </section>
            )}

            {/* Toolbar */}
            <section className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="flex flex-1 gap-2">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search title/description/category..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
                    />
                    <button
                        onClick={() => fetchItems(q)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                    >
                        Search
                    </button>
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-sm text-white/70">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    >
                        <option value="all" className="bg-black">
                            all
                        </option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-black">
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {/* List */}
            <section className="mt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Listings</h3>
                    <div className="text-sm text-white/60">{loading ? "Loading..." : `${filtered.length} shown`}</div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {!loading && filtered.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                            No listings yet. Post the first one above.
                        </div>
                    )}

                    {filtered.map((item) => {
                        const isOwner = Boolean(userId && item.user_id && item.user_id === userId);

                        return (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-base font-semibold">{item.title}</div>
                                            <span className="text-xs rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/70">
                                                {item.category || "General"}
                                            </span>
                                            <span className="text-xs rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/70">
                                                {item.status || "active"}
                                            </span>
                                        </div>

                                        <div className="mt-1 text-sm text-white/80 line-clamp-3">{item.description}</div>

                                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                                            <span className="font-semibold text-yellow-200">
                                                {money(Number(item.price || 0))}
                                            </span>
                                            {item.contact_email && (
                                                <span className="text-white/60">
                                                    Contact: <span className="text-white/80">{item.contact_email}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {isOwner && (
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {(item.created_at || item.updated_at) && (
                                    <div className="mt-3 text-xs text-white/50">
                                        {item.created_at ? `Created: ${new Date(item.created_at).toLocaleString()}` : ""}
                                        {item.updated_at ? ` • Updated: ${new Date(item.updated_at).toLocaleString()}` : ""}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

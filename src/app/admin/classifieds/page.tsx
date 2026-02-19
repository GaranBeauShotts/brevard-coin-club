import { requireAdmin } from "@/lib/requireAdmin";

import { revalidatePath } from "next/cache";

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

    const { error } = await supabase
        .from("classifieds")
        .update({ status })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/classifieds");
}

export default async function AdminClassifiedsPage() {
    const { supabase } = await requireAdmin();

    const { data: classifieds, error } = await supabase
        .from("classifieds")
        .select(
            "id, title, description, price, category, status, contact_email, created_at, user_id"
        )
        .order("created_at", { ascending: false })
        .limit(200);

    if (error) {
        return (
            <div>
                <h2>Moderate Classifieds</h2>
                <pre>Failed to load: {error.message}</pre>
            </div>
        );
    }

    return (
        <div>
            <h2>Moderate Classifieds</h2>
            <p style={{ opacity: 0.8 }}>
                Showing newest first. You can deactivate (soft-remove) or permanently delete.
            </p>

            {!classifieds?.length ? (
                <p>No classifieds found.</p>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {classifieds.map((c) => (
                        <div
                            key={c.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: 12,
                                padding: 12,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 12,
                                    alignItems: "flex-start",
                                }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                        <b style={{ fontSize: 16 }}>{c.title}</b>
                                        <span style={{ opacity: 0.7 }}>${Number(c.price).toFixed(2)}</span>
                                        <span
                                            style={{
                                                fontSize: 12,
                                                padding: "2px 8px",
                                                borderRadius: 999,
                                                border: "1px solid #ccc",
                                                opacity: 0.8,
                                            }}
                                        >
                                            {c.category}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 12,
                                                padding: "2px 8px",
                                                borderRadius: 999,
                                                border: "1px solid #ccc",
                                                opacity: 0.8,
                                            }}
                                        >
                                            status: {c.status}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                                        {new Date(c.created_at).toLocaleString()}
                                        {c.contact_email ? ` • ${c.contact_email}` : ""}
                                        {c.user_id ? ` • user: ${c.user_id}` : ""}
                                    </div>

                                    <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
                                        {c.description}
                                    </p>
                                </div>

                                <div style={{ display: "grid", gap: 8, minWidth: 140 }}>
                                    {/* Soft action: set status */}
                                    {c.status !== "inactive" ? (
                                        <form action={setStatus}>
                                            <input type="hidden" name="id" value={c.id} />
                                            <input type="hidden" name="status" value="inactive" />
                                            <button type="submit" style={{ width: "100%" }}>
                                                Deactivate
                                            </button>
                                        </form>
                                    ) : (
                                        <form action={setStatus}>
                                            <input type="hidden" name="id" value={c.id} />
                                            <input type="hidden" name="status" value="active" />
                                            <button type="submit" style={{ width: "100%" }}>
                                                Reactivate
                                            </button>
                                        </form>
                                    )}

                                    {/* Hard delete */}
                                    <form action={deleteClassified}>
                                        <input type="hidden" name="id" value={c.id} />
                                        <button
                                            type="submit"
                                            style={{
                                                width: "100%",
                                                background: "crimson",
                                                color: "white",
                                                border: "none",
                                                padding: "8px 10px",
                                                borderRadius: 8,
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </form>
 
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

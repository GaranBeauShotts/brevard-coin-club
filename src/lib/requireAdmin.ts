import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export async function requireAdmin() {
  const supabase = await supabaseServer();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  const user = auth?.user;

  if (authError || !user) redirect("/login");

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRow) redirect("/");

  return { supabase, user };
}

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";


export async function requireAdmin() {
  const supabase = await supabaseServer();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user;

  if (authError || !user) {
    redirect("/login");
  }

  // 🔥 Check role from profiles table instead
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/");
  }

  return { supabase, user };
}

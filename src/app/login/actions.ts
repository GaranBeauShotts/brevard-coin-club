"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await supabaseServer();

  // 1️⃣ Authenticate
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message || "Login failed")}`);
  }

  const userId = data.user.id;

  // 2️⃣ Get profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    redirect("/account"); // fallback safely
  }

  // 3️⃣ Redirect based on role
  if (profile.role === "admin") {
    redirect("/admin");
  }

  redirect("/account");
}

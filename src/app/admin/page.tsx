import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function AdminHome() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return <div>Admin: {data.user.email}</div>;
}

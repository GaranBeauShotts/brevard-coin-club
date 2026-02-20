import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AccountClient userId={user.id} userEmail={user.email ?? ""} />;
}

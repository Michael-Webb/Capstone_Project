"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
const handleLogout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
};

export default function LogoutDialog({ status }: any) {
  const showLogoutDialog = status === "authenticated";;

  return <Button onClick={handleLogout}>Logout</Button>;
}

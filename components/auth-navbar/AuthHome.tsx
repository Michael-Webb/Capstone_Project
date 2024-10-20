import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild>
        <Link href="/home">Home</Link>
      </Button>
    </div>
  ) : (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}

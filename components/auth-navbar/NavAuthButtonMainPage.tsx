'use client'
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NavAuthButtonMainPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Button variant={"outline"} asChild>
      <Link href="/home">Go to HomePage</Link>
    </Button>
    </div>
  ) : (
    <Button asChild >
      <Link href="/login">Login</Link>
    </Button>
  );
}

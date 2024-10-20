"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeToggleButton from "@/components/auth-navbar/ThemeToggleButton";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Sidebar from "@/components/auth-navbar/Sidebar";

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((data) => {
      setIsLoggedIn(data.data.user !== null);
    });
  }, []);

  const pathname = usePathname();
  const isLoginPage = pathname.endsWith("/login");

  return (
    <header className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
      {isLoggedIn ? <Sidebar /> : null}
      <div>
        {isLoginPage ? (
          <Button variant="outline" asChild className="group">
            <Link href="/" className="flex items-center justify-center">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <Button variant="outline" asChild className="group">
            <Link href="/home" prefetch={false}>
              Home Page
            </Link>
          </Button>
        ) : !isLoginPage ? (
          <Button asChild className="group">
            <Link
              href="/login"
              prefetch={false}
            >
              Login
            </Link>
          </Button>
        ) : null}
        <ThemeToggleButton />
      </div>
    </header>
  );
}

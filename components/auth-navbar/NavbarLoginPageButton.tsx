'use client'
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NavBarLoginBackButton() {
  const pathname = usePathname();
  const isLoginPage = pathname.endsWith("/login");

  return (
    <>
      {isLoginPage && (
        <Button variant="outline" asChild className="group">
          <Link href="/" className="flex items-center justify-center">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </Button>
      )}
    </>
  );
}

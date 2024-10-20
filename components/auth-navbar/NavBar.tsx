import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import logo from "@/public/assets/images/logo.png";
import AuthButton from "@/components/auth-navbar/AuthButton";
import Sidebar from "@/components/auth-navbar/Sidebar";

export default function NavBar() {
  return (
    <nav className="flex h-16 w-full items-center justify-between bg-background border-b px-4 md:px-6">
      <div className="w-full flex justify-between items-center px-3">
        <div className="flex items-start gap-2">
          <Sidebar />
        </div>
        <div className="flex items-start gap-2">
          <Image src={logo} alt="Mayskie logo" width={40} style={{ height: "auto" }} />
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

import { ReactNode } from "react";
import NavBar from "@/components/auth-navbar/NavBarMainPage";
export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

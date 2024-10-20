import Header from "@/components/auth-navbar/Header";
import NavBar from "@/components/auth-navbar/NavBarMainPage";

export default async function Home() {

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <NavBar />
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <div className="self-center"></div>
        </main>
      </div>
    </div>
  );
}

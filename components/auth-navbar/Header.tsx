import logo from "@/public/assets/images/logo.png";
import Image from "next/image";

export default function Header() {
  return (
    <div className="h-64 flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <Image src={logo} priority={true} alt="Mayskie logo" 
        width={300} style={{height:"auto"}}/>
      </div>
      <h1 className="sr-only">Your Inventory Management System and AI assistant with MayskieTools</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Your Inventory Management System and AI assistant with <b>MayskieTools</b>{" "}
      </p>
    </div>
  );
}

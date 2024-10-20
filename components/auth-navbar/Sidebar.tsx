"use client";

import useMediaQuery from "@custom-react-hooks/use-media-query";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "../ui/separator";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop === true) {
    return (
      <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant={"outline"}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={isDesktop === true ? "left" : "top"} className="w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-center text-3xl">Menu</SheetTitle>
            <SheetDescription></SheetDescription>
            <Separator />
          </SheetHeader>
          <Button variant={"ghost"} onClick={() => setIsOpen(false)} className="w-full text-md" asChild>
            <Link href="/home" className="text-md">Home</Link>
          </Button>
          <Button variant={"ghost"} onClick={() => setIsOpen(false)} className="w-full text-md" asChild>
            <Link href="/home/inventory" className="text-md">View Inventory</Link>
          </Button>
          <Button variant={"ghost"} onClick={() => setIsOpen(false)} className="w-full text-md" asChild>
            <Link href="/home/listings/new" className="text-md">Create Listing</Link>
          </Button>
          <Button variant={"ghost"} onClick={() => setIsOpen(false)} className="w-full text-md" asChild>
            <Link href="/home/assistant" className="text-md">AI Assistant</Link>
          </Button>
          <Button variant={"ghost"}  onClick={() => setIsOpen(false)} className="w-full text-md" asChild>
            <Link href="/home/admin" className="text-md">Admin</Link>
          </Button>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant={"outline"}>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          {/* <DrawerDescription>Navigate to a Page</DrawerDescription> */}
        </DrawerHeader>
        <Separator />
        <DrawerFooter>
          <Button onClick={() => setIsOpen(false)} variant={"ghost"} className="w-full text-md" asChild>
          <Link href="/home">Home</Link>
        </Button>
        <Button onClick={() => setIsOpen(false)} variant={"ghost"} className="w-full text-md" asChild>
          <Link href="/home/inventory">View Inventory</Link>
        </Button>
        <Button onClick={() => setIsOpen(false)} variant={"ghost"} className="w-full text-md" asChild>
          <Link href="/home/listings/new">Create Listing</Link>
        </Button>
        <Button onClick={() => setIsOpen(false)} variant={"ghost"} className="w-full text-md" asChild>
          <Link href="/home/assistant">AI Assistant</Link>
        </Button>
        <Button onClick={() => setIsOpen(false)} variant={"ghost"} className="w-full text-md" asChild>
          <Link href="/home/admin">Admin</Link>
        </Button>
        <DrawerClose>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

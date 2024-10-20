import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Footer from "@/components/auth-navbar/Footer";
import { Toaster } from "@/components/ui/toaster";
import { WebVitals } from './_components/web-vitals'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MayskieTools",
  description: "Your AI Assistant for clothing reselling!",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>

      <body className={cn("bg-background text-foreground flex flex-col min-h-screen", fontSans.variable)}>
      {/* <WebVitals /> */}
        <ThemeProvider attribute="class">
          <main className="flex-1 flex flex-col">
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </main>
          <Footer />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

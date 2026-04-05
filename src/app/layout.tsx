import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Logo from "@/components/Logo";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "StomkScreemer - Indian Stock Market Intelligence",
  description:
    "AI-powered stock screener with technicals, fundamentals, sector analysis & news for Indian markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        <header className="border-b-[2px] border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-3 bg-cream overflow-hidden">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 border-[2px] border-border rounded-xl px-2.5 py-1.5 hover:bg-fg/5 transition-colors"
          >
            <Logo size={24} />
            <span className="text-base sm:text-lg font-bold tracking-tight hidden sm:inline">
              Stomk<span className="text-green-dark">Screemer</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/stocks"
              className="btn bg-yellow px-3 sm:px-4 py-1.5 text-sm inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <BarChart3 size={14} strokeWidth={3} />
              <span className="hidden sm:inline">Top&nbsp;Stocks</span>
              <span className="sm:hidden">Stocks</span>
            </Link>
            <SearchBar />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-[2px] border-border px-4 sm:px-6 py-4 bg-cream">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted font-semibold">
            <div className="flex items-center gap-2">
              <Logo size={18} />
              <span>StomkScreemer</span>
            </div>
            <p>&copy; {new Date().getFullYear()} StomkScreemer. All rights reserved.</p>
            <p>Data from Yahoo Finance &middot; Not financial advice</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import GuitarLogo from "@/components/GuitarLogo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worship Team Lineup",
  description: "Schedule and manage the worship team lineup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border bg-surface">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-4 text-sm">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <GuitarLogo />
              Worship Team Lineup
            </Link>
            <Link href="/" className="text-muted hover:text-foreground">
              Services
            </Link>
            <Link href="/volunteers" className="text-muted hover:text-foreground">
              Volunteers
            </Link>
            <Link href="/archive" className="text-muted hover:text-foreground">
              Archive
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

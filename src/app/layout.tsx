import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Worship Team Lineup",
  description: "Schedule and manage the worship team lineup",
};

// Sets data-theme on <html> before first paint so there's no flash of the
// wrong mode: a persisted choice in localStorage wins, otherwise the OS
// preference decides. Runs as a plain blocking script (not next/script) so
// it executes ahead of hydration.
const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${newsreader.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <NavBar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-8 py-8">{children}</main>
      </body>
    </html>
  );
}

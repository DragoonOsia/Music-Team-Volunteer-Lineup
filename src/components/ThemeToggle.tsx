"use client";

type Theme = "light" | "dark";

// No React state on purpose: the "active" pill is driven purely by a CSS
// attribute selector against <html data-theme>, so there's zero hydration
// mismatch risk (the theme init script in layout.tsx sets that attribute
// before this ever renders) and no client/server disagreement to resync.
function choose(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

export default function ThemeToggle() {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-rule p-0.5 font-mono text-[11px] font-medium tracking-[0.14em] uppercase"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => choose("light")}
        className="rounded-full px-3 py-1 text-ink3 hover:text-ink [html[data-theme=light]_&]:bg-accent [html[data-theme=light]_&]:text-accent-foreground"
      >
        Day
      </button>
      <button
        type="button"
        onClick={() => choose("dark")}
        className="rounded-full px-3 py-1 text-ink3 hover:text-ink [html[data-theme=dark]_&]:bg-accent [html[data-theme=dark]_&]:text-accent-foreground"
      >
        Night
      </button>
    </div>
  );
}

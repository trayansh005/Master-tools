"use client";
import Link from "next/link";

export default function Sidebarfilter({
}: {
}) {
  return (
    <aside className="hidden md:block border-r pr-4">
      <nav className="sticky top-6 max-h-[80vh] overflow-auto" style={{ backgroundColor: "#eee", height: "100vh" }}>
        <span className="font-medium">Flter by</span>
        <div className="h-0.5 bg-[var(--accent-green)] my-2"></div>
        <ul className="space-y-2 text-sm text-[var(--foreground)]">
          
        </ul>
      </nav>
    </aside>
  );
}

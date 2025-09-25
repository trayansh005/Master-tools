"use client";
import Link from "next/link";

export default function Sidebar({
  categories,
  activeSlug,
}: {
  categories: { _id: string; name: string }[];
  activeSlug?: string | null;
}) {
  return (
    <aside className="hidden md:block border-r pr-4">
      <nav className="sticky top-6 max-h-[80vh] overflow-auto">
        <span className="font-medium">Choose a category</span>
        <div className="h-0.5 bg-[var(--accent-green)] my-2"></div>
        <ul className="space-y-2 text-sm text-[var(--foreground)]">
          <li>
            <Link
              href="/"
              className={`block px-2 py-1 rounded ${
                !activeSlug ? "bg-[var(--accent-yellow)] text-dark" : "hover:bg-[var(--accent-lightyellow)]"
              }`}
            >
              All Products
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                href={`/?category=${cat._id}`}
                className={`block px-2 py-1 rounded ${
                  activeSlug === cat._id ? "bg-[var(--accent-yellow)] text-dark" : "hover:bg-[var(--accent-lightyellow)]"
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

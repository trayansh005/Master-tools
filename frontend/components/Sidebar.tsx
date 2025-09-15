import Link from "next/link";
import { slugify } from "../data/catalog";

export default function Sidebar({
	categories,
	activeSlug,
}: {
	categories: string[];
	activeSlug?: string | null;
}) {
	return (
		<aside className="hidden md:block border-r ">
			<nav className="sticky top-6 max-h-[80vh] overflow-auto pr-2">
				<span>Choose a category</span>
				<div className="h-0.5 bg-[var(--accent)]  my-1"></div>
				<ul className="space-y-2 text-sm text-[var(--foreground)]">
					{categories.map((cat) => {
						const s = slugify(cat);
						const active = activeSlug === s;
						return (
							<li
								key={cat}
								className={`flex items-center gap-3 ${
									active ? "text-[var(--accent)] font-semibold" : "hover:text-[var(--accent)]"
								}`}
							>
								<Link href={`/product/${s}`} className="flex-1">
									{cat}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
}

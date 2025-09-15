import { findBySlug } from "@/data/catalog";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CatalogList from "@/components/CatalogList";
import { CATEGORIES } from "@/data/categories";
import { CATALOG } from "@/data/catalog";

interface Props {
	params: { slug: string };
}

export default function ProductPage({ params }: Props) {
	const { slug } = params;
	const section = findBySlug(slug);
	const categories = Array.from(new Set([...CATALOG.map((s) => s.title), ...CATEGORIES]));

	return (
		<div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
			<Header />

			<div className="px-2 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
				<Sidebar categories={categories} activeSlug={slug} />

				<main>
					{section ? <CatalogList catalog={[section]} /> : <div>Category not found.</div>}
				</main>
			</div>
		</div>
	);
}

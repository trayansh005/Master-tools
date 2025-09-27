"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Product {
	_id: string;
	name: string;
	imageUrl?: string;
	category?: { name: string };
}

interface CatalogListProps {
	categoryId?: string; // comes from page.tsx activeSlug
	searchQuery?: string; // comes from Header component
}

export default function CatalogList({ categoryId, searchQuery }: CatalogListProps) {
	const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

	// Use React Query to fetch products (will use prefetched data if available)
	const { data: products = [], isLoading } = useQuery<Product[]>({
		queryKey: ["products", categoryId, searchQuery],
		queryFn: async () => {
			let url = `${API_BASE}/api/products?`;
			if (categoryId) url += `category=${categoryId}&`;
			if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

			const res = await fetch(url);
			if (!res.ok) throw new Error("Failed to fetch products");
			return res.json();
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		// For initial load without filters, assume data is prefetched
		enabled: !!(categoryId || searchQuery || true), // Always enabled but with different behavior
	});

	// Don't show loading for initial load since data should be prefetched
	if (isLoading && (categoryId || searchQuery)) return <div>Loading...</div>;
	if (!products.length && !isLoading)
		return <div className="text-gray-500 text-sm">No products found</div>;

	return (
		<div>
			{/* {categoryId ? `${products.length} product${products.length !== 1 ? "s" : ""} in  ${products[0]?.category?.name || ""} Category`: `All Products (${products.length})`} */}
			<div className="text-brand-green font-bold text-xl text-gray-600 mb-4">
				{categoryId ? `${products[0]?.category?.name || ""}` : `All Products (${products.length})`}
			</div>
			<div className="grid grid-cols-12 sm:grid-cols-14 md:grid-cols-16 gap-6">
				{products.map((product) => (
					<Link key={product._id} href={`/product/${product._id}`}>
						<div className="flex flex-col items-center text-center">
							{product.imageUrl ? (
								<img
									src={
										product.imageUrl.startsWith("http")
											? product.imageUrl
											: `${API_BASE}/api/${product.imageUrl}`
									}
									alt={product.name}
									className="w-100 h-20 object-cover rounded-lg shadow-sm"
								/>
							) : (
								<div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg">
									<span className="text-gray-400 text-xs">No image</span>
								</div>
							)}
							<div className="mt-2 font-medium text-sm">{product.name}</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

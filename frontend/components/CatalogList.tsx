"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface CatalogListProps {
	categoryId?: string; // comes from page.tsx activeSlug
	searchQuery?: string; // comes from Header component
}

export default function CatalogList({ categoryId, searchQuery }: CatalogListProps) {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

	console.log(API_BASE);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				let url = `${API_BASE}/api/products?`;
				if (categoryId) url += `category=${categoryId}&`;
				if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

				const res = await fetch(url);
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				console.error("Error fetching products:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [categoryId, searchQuery]);

	if (loading) return <div>Loading...</div>;
	if (!products.length) return <div className="text-gray-500 text-sm">No products found</div>;

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
											: `${API_BASE}${product.imageUrl}`
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

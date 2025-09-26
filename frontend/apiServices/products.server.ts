"use server";

const API_BASE =
	(typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
	"http://localhost:3001";

export async function fetchProductsServer(categoryId?: string, searchQuery?: string) {
	let url = `${API_BASE}/api/products?`;
	if (categoryId) url += `category=${categoryId}&`;
	if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) {
		throw new Error("Failed to fetch products on server");
	}
	return res.json();
}

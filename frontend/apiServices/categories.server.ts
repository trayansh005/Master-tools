"use server";

const API_BASE =
	(typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
	"http://localhost:3001";

export async function fetchCategoriesServer() {
	const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" });
	if (!res.ok) {
		throw new Error("Failed to fetch categories on server");
	}
	return res.json();
}

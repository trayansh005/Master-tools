"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
	const [name, setName] = useState("");
	type Category = {
		_id: string;
		name: string;
		description?: string;
	  };
	  
	const [categories, setCategories] = useState<Category[]>([]);
	  
	const [loading, setLoading] = useState(false);

	const API_BASE =
		(typeof window !== "undefined" && (window as any).__NEXT_DATA__?.env?.BACKEND_URL) ||
		process.env.NEXT_PUBLIC_BACKEND_URL ||
		"http://localhost:3001";



	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
		  const res = await fetch(`${API_BASE}/api/categories`);
		  if (!res.ok) throw new Error("Failed to load");
		  const data = await res.json();
		  console.log("Fetched categories:", data); // 👀
		  setCategories(data);
		} catch (err) {
		  console.error(err);
		}
	  };

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE}/api/categories`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: name.trim() }),
			});
			if (!res.ok) throw new Error("create failed");
			setName("");
			await fetchCategories();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
		  const res = await fetch(`${API_BASE}/api/categories/${id}`, {
			method: "DELETE",
		  });
		  if (!res.ok) throw new Error("delete failed");
		  await fetchCategories();
		} catch (err) {
		  console.error(err);
		}
	  };
	  
	  const handleUpdate = async (id: string) => {
		const newName = prompt("Enter new category name:");
		if (!newName) return;
		try {
		  const res = await fetch(`${API_BASE}/api/categories/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newName }),
		  });
		  if (!res.ok) throw new Error("update failed");
		  await fetchCategories();
		} catch (err) {
		  console.error(err);
		}
	  };
	  

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h2 className="text-lg font-medium mb-4">Manage Product Categories</h2>

			<form onSubmit={handleCreate} className="flex gap-2 mb-4">
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="New category name"
					className="border px-3 py-2 rounded flex-1"
				/>
				<button disabled={loading} className="bg-[var(--accent)] text-white px-4 py-2 rounded">
					{loading ? "Adding..." : "Add"}
				</button>
			</form>

			<div>
				{categories.length === 0 ? (
					<div className="text-sm text-gray-500">No categories yet</div>
				) : (
					<ul className="space-y-2">
					{categories.map((c) => (
						<li key={c._id} className="border px-3 py-2 rounded flex justify-between items-center">
						<span>{c.name}</span>
						<div className="flex gap-2">
							<button
							onClick={() => handleUpdate(c._id)}
							className="text-blue-500 hover:underline"
							>
							Edit
							</button>
							<button
							onClick={() => handleDelete(c._id)}
							className="text-red-500 hover:underline"
							>
							Delete
							</button>
						</div>
						</li>
					))}
					</ul>
				)}
			</div>
		</div>
	);
}

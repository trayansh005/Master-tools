"use client";

import Link from "next/link";

export default function AdminHome() {
	return (
		<div>
			<p className="mb-4">Welcome to the admin dashboard. Use the links to manage site content.</p>
			<div className="space-x-3">
				<Link href="/admin/categories" className="bg-[var(--accent)] text-white px-3 py-2 rounded">
					Manage Categories
				</Link>
			</div>
		</div>
	);
}

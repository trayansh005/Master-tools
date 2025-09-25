import Link from "next/link";

export const metadata = {
	title: "Admin - Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">


			<div className="px-4 py-6">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-semibold">Admin Dashboard</h1>
					<nav className="space-x-3 text-sm flex">
						<Link href="/" className="text-[var(--accent)]">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
						<path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
						</svg>
						</Link>
						<Link href="/admin" className="text-[var(--accent)]">
							Dashboard
						</Link>
						<Link href="/admin/categories" className="text-[var(--accent)]">
							Categories
						</Link>
						<Link href="/admin/products" className="text-[var(--accent)]">
							Products
						</Link>
						<Link href="/admin/orders" className="text-[var(--accent)]">
							Orders
						</Link>
					</nav>
				</div>

				<div>{children}</div>
			</div>
		</div>
	);
}

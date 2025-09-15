import Header from "../../components/Header";
import Link from "next/link";

export const metadata = {
	title: "Admin - Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
			<Header />

			<div className="px-4 py-6">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-semibold">Admin Dashboard</h1>
					<nav className="space-x-3 text-sm">
						<Link href="/admin" className="text-[var(--accent)]">
							Home
						</Link>
						<Link href="/admin/categories" className="text-[var(--accent)]">
							Categories
						</Link>
					</nav>
				</div>

				<div>{children}</div>
			</div>
		</div>
	);
}

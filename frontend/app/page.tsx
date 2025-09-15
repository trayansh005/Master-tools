"use client";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CatalogList from "../components/CatalogList";
import { CATALOG } from "../data/catalog";
import { CATEGORIES } from "../data/categories";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

export default function Home() {
	const categories = Array.from(new Set([...CATALOG.map((s) => s.title), ...CATEGORIES]));
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
			<Header />

			{/* Auth Navigation */}
			<div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
				<div>
					{user ? (
						<span className="text-sm text-gray-700">Welcome, {user.name}!</span>
					) : (
						<span className="text-sm text-gray-700">Please sign in to access all features</span>
					)}
				</div>
				<div className="space-x-4">
					{user ? (
						<>
							<Link
								href="/dashboard"
								className="text-[var(--accent)] hover:text-[var(--accent-strong)] text-sm"
							>
								Dashboard
							</Link>
							<button
								onClick={handleLogout}
								className="text-[var(--accent)] hover:text-[var(--accent-strong)] text-sm"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								href="/auth/login"
								className="text-[var(--accent)] hover:text-[var(--accent-strong)] text-sm"
							>
								Login
							</Link>
							<Link
								href="/auth/register"
								className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white px-3 py-1 rounded text-sm"
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>

			<div className="px-2 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
				<Sidebar categories={categories} />

				<main>
					<CatalogList catalog={CATALOG} />
				</main>
			</div>
		</div>
	);
}

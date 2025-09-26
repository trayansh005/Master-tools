"use client";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CatalogList from "../components/CatalogList";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function HomeClient() {
	const { user, logout } = useAuth();
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(""); // new state
	const searchParams = useSearchParams();
	const activeSlug = searchParams.get("category"); // currently selected categoryId

	// read categories from react-query cache (prefetched on server)
	const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<
		{ _id: string; name: string }[]
	>({
		queryKey: ["categories"],
		// no queryFn: rely on server-prefetched & hydrated cache
	});

	useEffect(() => {
		setLoading(isCategoriesLoading);
	}, [isCategoriesLoading]);

	// ...removed local fetch effect; react-query provides categories

	const handleLogout = async () => {
		await logout();
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			{/* Auth Navigation */}
			<div className="bg-brand-green px-4 text-white py-2 flex justify-between items-center">
				<div className="text-center" style={{ width: "88%" }}>
					{user ? (
						<span className="text-sm">
							Welcome, {user.name}! We deliver to over 150 countries, including the UK and EU
							nations, in 2-4 days! Click here to learn more about delivery to your area.
						</span>
					) : (
						<span className="text-sm text-white">Please sign in to access all features</span>
					)}
				</div>
				<div className="space-x-4">
					{user ? (
						<>
							{user.name === "admin" ? (
								<Link href="/admin/" className="text-sm">
									Admin Dashboard
								</Link>
							) : (
								<Link href="/dashboard" className="text-sm">
									Dashboard
								</Link>
							)}
							<button onClick={handleLogout} className="text-sm">
								Logout
							</button>
						</>
					) : (
						<>
							<Link href="/auth/login" className="text-sm">
								Login
							</Link>
							<Link
								href="/auth/register"
								className="bg-[var(--accent-green)] hover:bg-[var(--accent-lightyellow)] text-[var(--background)] hover:text-[var(--accent-dark)] px-3 py-1 rounded text-sm"
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
			{/* Sidebar + CatalogList */}
			<div className="px-2 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
				<Sidebar categories={categories} activeSlug={activeSlug} />
				<main>
					<CatalogList categoryId={activeSlug || undefined} searchQuery={searchQuery} />
				</main>
			</div>
		</div>
	);
}

"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export default function ProtectedRoute({
	children,
	redirectTo = "/auth/login",
}: ProtectedRouteProps) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push(redirectTo);
		}
	}, [user, loading, router, redirectTo]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}

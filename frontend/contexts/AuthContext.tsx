"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
	register: (
		name: string,
		email: string,
		password: string
	) => Promise<{ success: boolean; message: string }>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

	const checkAuth = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success && data.user) {
					setUser(data.user);
				}
			}
		} catch (error) {
			console.error("Auth check failed:", error);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (data.success && data.user) {
				setUser(data.user);
				return { success: true, message: data.message };
			} else {
				return { success: false, message: data.message || "Login failed" };
			}
		} catch (error) {
			console.error("Login error:", error);
			return { success: false, message: "Network error occurred" };
		}
	};

	const register = async (name: string, email: string, password: string) => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ name, email, password }),
			});

			const data = await response.json();

			if (data.success && data.user) {
				setUser(data.user);
				return { success: true, message: data.message };
			} else {
				return { success: false, message: data.message || "Registration failed" };
			}
		} catch (error) {
			console.error("Registration error:", error);
			return { success: false, message: "Network error occurred" };
		}
	};

	const logout = async () => {
		try {
			await fetch(`${API_BASE_URL}/api/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const value = {
		user,
		loading,
		login,
		register,
		logout,
		checkAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

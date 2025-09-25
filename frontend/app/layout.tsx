import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MasterGlobalSupplier - Tools Store",
	description: "Your one-stop shop for all tools and supplies",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				style={{ colorScheme: "light" }}
			>
				<AuthProvider>
					<CartProvider>
						<ThemeProvider>
							<SidebarProvider>{children}</SidebarProvider>
						</ThemeProvider>
					</CartProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

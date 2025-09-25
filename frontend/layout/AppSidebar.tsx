"use client";
import { Calendar, ChevronDown, Grid, MoreHorizontal, User, UserCheck, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";

type NavItem = {
	name: string;
	icon: React.ReactNode;
	path?: string;
	subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
	{
		icon: <User size={20} />,
		name: "Admin",
		subItems: [
			{ name: "Dashboard", path: "/admin", pro: false },
			{ name: "Categories", path: "/admin/categories", pro: false },
			{ name: "Products", path: "/admin/products", pro: false },
			{ name: "Orders", path: "/admin/orders", pro: false },
		],
	},

	{
		icon: <UserCheck size={20} />,
		name: "User Profile",
		path: "/admin/profile",
	},
];

const AppSidebar: React.FC = () => {
	const {
		isExpanded,
		isMobileOpen,
		isHovered,
		setIsHovered,
		openSubmenu,
		toggleSubmenu,
		activeItem,
		setActiveItem,
	} = useSidebar();
	const { user, logout } = useAuth();
	const pathname = usePathname();

	const isActive = useCallback((path: string) => path === pathname, [pathname]);

	useEffect(() => {
		// Set active item based on pathname
		let found = false;
		navItems.forEach((nav) => {
			if (nav.path && isActive(nav.path)) {
				setActiveItem(nav.name);
				found = true;
			} else if (nav.subItems) {
				nav.subItems.forEach((sub) => {
					if (isActive(sub.path)) {
						setActiveItem(nav.name);
						found = true;
					}
				});
			}
		});
		if (!found) setActiveItem(null);
	}, [pathname, isActive, setActiveItem]);

	const renderIcon = (icon: React.ReactNode) => {
		if (!React.isValidElement(icon)) return icon;
		const el = icon as React.ReactElement<any, any>;
		return React.cloneElement(el, {
			...el.props,
			className: `${el.props.className || ""} stroke-current`,
			stroke: "currentColor",
			color: "currentColor",
		});
	};

	const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
		<ul className="flex flex-col gap-2">
			{navItems.map((nav) => (
				<li key={nav.name}>
					{nav.subItems ? (
						<button
							onClick={() => toggleSubmenu(nav.name)}
							className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 hover:bg-white/10 hover:shadow-lg ${
								activeItem === nav.name
									? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
									: "text-gray-300 hover:text-white"
							} ${!isExpanded && !isHovered ? "justify-center px-3" : ""}`}
						>
							<span className="flex-shrink-0">{renderIcon(nav.icon)}</span>
							{(isExpanded || isHovered || isMobileOpen) && (
								<span className="flex-1 truncate">{nav.name}</span>
							)}
							{(isExpanded || isHovered || isMobileOpen) && (
								<ChevronDown
									className={`w-4 h-4 transition-transform duration-300 ${
										openSubmenu === nav.name ? "rotate-180" : ""
									}`}
								/>
							)}
						</button>
					) : (
						nav.path && (
							<Link
								href={nav.path}
								className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-white/10 hover:shadow-lg ${
									isActive(nav.path)
										? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
										: "text-gray-300 hover:text-white"
								} ${!isExpanded && !isHovered ? "justify-center px-3" : ""}`}
							>
								<span className="flex-shrink-0">{renderIcon(nav.icon)}</span>
								{(isExpanded || isHovered || isMobileOpen) && (
									<span className="flex-1 truncate">{nav.name}</span>
								)}
							</Link>
						)
					)}
					{nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
						<div
							className={`ml-6 mt-2 overflow-hidden transition-all duration-300 ${
								openSubmenu === nav.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
							}`}
						>
							<ul className="space-y-1">
								{nav.subItems.map((subItem) => (
									<li key={subItem.name}>
										<Link
											href={subItem.path}
											className={`block rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-white/10 ${
												isActive(subItem.path)
													? "bg-white/20 text-white font-medium"
													: "text-gray-400 hover:text-gray-200"
											}`}
										>
											{subItem.name}
											<span className="flex items-center gap-1 ml-auto">
												{subItem.new && (
													<span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
														new
													</span>
												)}
												{subItem.pro && (
													<span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-semibold text-white">
														pro
													</span>
												)}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</li>
			))}
		</ul>
	);

	return (
		<aside
			className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 h-screen transition-all duration-500 ease-in-out z-50 backdrop-blur-xl bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-r border-white/10 shadow-2xl ${
				isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
			} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
			onMouseEnter={() => !isExpanded && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={`py-8 flex items-center gap-3 ${
					!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
				}`}
			>
				<Link href="/" className="flex items-center gap-3 group">
					{isExpanded || isHovered || isMobileOpen ? (
						<>
							<div className="relative">
								<Image
									className="dark:hidden transition-transform duration-300 group-hover:scale-105"
									src="/logo.png"
									alt="Logo"
									width={150}
									height={40}
								/>
								<Image
									className="hidden dark:block transition-transform duration-300 group-hover:scale-105"
									src="/logo.png"
									alt="Logo"
									width={150}
									height={40}
								/>
							</div>
						</>
					) : (
						<div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 transition-transform duration-300 hover:scale-110">
							<Image src="/images/logo/logo-icon.svg" alt="Logo" width={24} height={24} />
						</div>
					)}
				</Link>
			</div>
			<div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
				<nav className="mb-6">
					<div className="flex flex-col gap-6">
						<div>
							<h2
								className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 font-semibold tracking-wider ${
									!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? (
									"Menu"
								) : (
									<MoreHorizontal className="w-4 h-4" />
								)}
							</h2>
							{renderMenuItems(navItems, "main")}
						</div>
					</div>
				</nav>
			</div>

			{/* User Profile Section */}
			{user && (
				<div className="mt-auto mb-6">
					<div
						className={`flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 ${
							!isExpanded && !isHovered ? "justify-center" : ""
						}`}
					>
						<div className="flex-shrink-0">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
								<User className="w-5 h-5 text-white" />
							</div>
						</div>
						{(isExpanded || isHovered || isMobileOpen) && (
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium text-white truncate">{user.name}</div>
								<div className="text-xs text-gray-400 truncate">{user.email}</div>
							</div>
						)}
						{(isExpanded || isHovered || isMobileOpen) && (
							<button
								onClick={logout}
								className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
								title="Logout"
							>
								<LogOut className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>
			)}
		</aside>
	);
};

export default AppSidebar;

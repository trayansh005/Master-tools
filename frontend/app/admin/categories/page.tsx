"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Tag, Search, X } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../../components/ui/table";

type Category = {
	_id: string;
	name: string;
	description?: string;
	createdAt?: string;
};

export default function CategoriesPage() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");

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
			if (!res.ok) throw new Error("Failed to load categories");
			const data = await res.json();
			setCategories(data);
		} catch (err) {
			console.error("Error fetching categories:", err);
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
				body: JSON.stringify({
					name: name.trim(),
					description: description.trim() || undefined,
				}),
			});
			if (!res.ok) throw new Error("Failed to create category");
			setName("");
			setDescription("");
			setIsCreateModalOpen(false);
			await fetchCategories();
		} catch (err) {
			console.error("Error creating category:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this category?")) return;

		try {
			const res = await fetch(`${API_BASE}/api/categories/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete category");
			await fetchCategories();
		} catch (err) {
			console.error("Error deleting category:", err);
		}
	};

	const handleEdit = (category: Category) => {
		setEditingCategory(category);
		setEditName(category.name);
		setEditDescription(category.description || "");
		setIsEditModalOpen(true);
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingCategory || !editName.trim()) return;

		setLoading(true);
		try {
			const res = await fetch(`${API_BASE}/api/categories/${editingCategory._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: editName.trim(),
					description: editDescription.trim() || undefined,
				}),
			});
			if (!res.ok) throw new Error("Failed to update category");
			setIsEditModalOpen(false);
			setEditingCategory(null);
			await fetchCategories();
		} catch (err) {
			console.error("Error updating category:", err);
		} finally {
			setLoading(false);
		}
	};

	const filteredCategories = categories.filter(
		(category) =>
			category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4">
			<div className="max-w-7xl mx-auto bg-slate-900/60 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
							<Tag className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
							<p className="text-gray-600 dark:text-gray-400">Manage your product categories</p>
						</div>
					</div>
				</div>

				{/* Stats Card */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-slate-800/40 rounded-2xl p-4 shadow-sm border border-slate-700/40">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Total Categories
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{categories.length}
								</p>
							</div>
							<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
								<Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
					</div>
					<div className="bg-slate-800/40 rounded-2xl p-4 shadow-sm border border-slate-700/40">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Active Categories
								</p>
								<p className="text-3xl font-bold text-green-600 dark:text-green-400">
									{categories.length}
								</p>
							</div>
							<div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
								<Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
						</div>
					</div>
					<div className="bg-slate-800/40 rounded-2xl p-4 shadow-sm border border-slate-700/40">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Categories Added
								</p>
								<p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
									This Month
								</p>
							</div>
							<div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
								<Edit2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
						</div>
					</div>
				</div>

				{/* Actions Bar */}
				<div className="bg-slate-800/40 rounded-2xl p-4 shadow-md border border-slate-700/40 mb-6">
					<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
							<input
								type="text"
								placeholder="Search categories..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-2 rounded-full shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
							/>
							{searchTerm && (
								<button
									onClick={() => setSearchTerm("")}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
						<Button
							onClick={() => setIsCreateModalOpen(true)}
							className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
							startIcon={<Plus className="w-4 h-4" />}
						>
							Add Category
						</Button>
					</div>
				</div>

				{/* Categories Table */}
				<div className="bg-slate-800/30 rounded-2xl shadow-md border border-slate-700/40 overflow-hidden">
					{filteredCategories.length === 0 ? (
						<div className="p-12 text-center">
							<Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								{searchTerm ? "No categories found" : "No categories yet"}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-6">
								{searchTerm
									? "Try adjusting your search terms"
									: "Get started by creating your first category"}
							</p>
							{!searchTerm && (
								<Button
									onClick={() => setIsCreateModalOpen(true)}
									className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
									startIcon={<Plus className="w-4 h-4" />}
								>
									Add Your First Category
								</Button>
							)}
						</div>
					) : (
						<Table className="w-full">
							<TableHeader className="bg-slate-800/60">
								<TableRow>
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white px-6 py-4 text-start"
									>
										Name
									</TableCell>
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white px-6 py-4 text-start"
									>
										Description
									</TableCell>
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white text-right px-6 py-4 "
									>
										Actions
									</TableCell>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredCategories.map((category) => (
									<TableRow
										key={category._id}
										className="hover:bg-slate-700/40 transition-colors border-b border-slate-700/20"
									>
										<TableCell className="font-medium text-white px-6 py-5">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-blue-600/10 rounded-lg">
													<Tag className="w-4 h-4 text-blue-400" />
												</div>
												<span>{category.name}</span>
											</div>
										</TableCell>
										<TableCell className="text-slate-300 px-6 py-5">
											{category.description || "No description"}
										</TableCell>
										<TableCell className="text-right px-6 py-5">
											<div className="flex items-center justify-end gap-3">
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleEdit(category)}
													startIcon={<Edit2 className="w-4 h-4" />}
													className="px-4 py-2 text-blue-300 border-blue-700/40 hover:bg-blue-700/20 rounded-lg transition-all duration-200"
												>
													Edit
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleDelete(category._id)}
													startIcon={<Trash2 className="w-4 h-4" />}
													className="px-4 py-2 text-red-300 border-red-700/40 hover:bg-red-700/20 rounded-lg transition-all duration-200"
												>
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>

				{/* Create Category Modal */}
				<Modal
					isOpen={isCreateModalOpen}
					onClose={() => setIsCreateModalOpen(false)}
					className="max-w-md"
				>
					<div className="p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
								<Plus className="w-6 h-6 text-white" />
							</div>
							<div>
								<h2 className="text-xl font-bold text-gray-900 dark:text-white">
									Add New Category
								</h2>
								<p className="text-gray-600 dark:text-gray-400">Create a new product category</p>
							</div>
						</div>

						<form onSubmit={handleCreate} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Category Name *
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter category name"
									className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Description
								</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Enter category description (optional)"
									rows={3}
									className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<Button
									variant="outline"
									onClick={() => setIsCreateModalOpen(false)}
									className="flex-1"
								>
									Cancel
								</Button>
								<Button
									disabled={loading || !name.trim()}
									className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
								>
									{loading ? "Creating..." : "Create Category"}
								</Button>
							</div>
						</form>
					</div>
				</Modal>

				{/* Edit Category Modal */}
				<Modal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					className="max-w-md"
				>
					<div className="p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
								<Edit2 className="w-6 h-6 text-white" />
							</div>
							<div>
								<h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Category</h2>
								<p className="text-gray-600 dark:text-gray-400">Update category information</p>
							</div>
						</div>

						<form onSubmit={handleUpdate} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Category Name *
								</label>
								<input
									type="text"
									value={editName}
									onChange={(e) => setEditName(e.target.value)}
									placeholder="Enter category name"
									className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Description
								</label>
								<textarea
									value={editDescription}
									onChange={(e) => setEditDescription(e.target.value)}
									placeholder="Enter category description (optional)"
									rows={3}
									className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<Button
									variant="outline"
									onClick={() => setIsEditModalOpen(false)}
									className="flex-1"
								>
									Cancel
								</Button>
								<Button
									disabled={loading || !editName.trim()}
									className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
								>
									{loading ? "Updating..." : "Update Category"}
								</Button>
							</div>
						</form>
					</div>
				</Modal>
			</div>
		</div>
	);
}

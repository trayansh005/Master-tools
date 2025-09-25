"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Package, Search, X, Settings } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../../components/ui/table";

export default function ProductsPage() {
	const [categories, setCategories] = useState<any[]>([]);
	const [products, setProducts] = useState<any[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<any | null>(null);
	const [form, setForm] = useState({
		name: "",
		price: "",
		description: "",
		stock: "",
		categoryId: "",
		image: null as File | null,
	});
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [loading, setLoading] = useState(false);

	const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

	useEffect(() => {
		fetchCategories();
		fetchProducts();
	}, []);

	const fetchCategories = async () => {
		const res = await fetch(`${API_BASE}/api/categories`);
		const data = await res.json();
		setCategories(data);
	};

	const fetchProducts = async () => {
		const res = await fetch(`${API_BASE}/api/products`);
		const data = await res.json();
		setProducts(data);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setForm({ ...form, image: file });
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			setForm({ ...form, image: file });
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const resetForm = () => {
		setForm({ name: "", price: "", description: "", stock: "", categoryId: "", image: null });
		setImagePreview(null);
		setEditingId(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData();
		formData.append("name", form.name);
		formData.append("price", form.price);
		formData.append("description", form.description);
		formData.append("stock", form.stock);
		formData.append("categoryId", form.categoryId);
		if (form.image) {
			formData.append("image", form.image);
		}

		try {
			if (editingId) {
				// Update
				await fetch(`${API_BASE}/api/products/${editingId}`, {
					method: "PUT",
					body: formData,
				});
			} else {
				// Create
				await fetch(`${API_BASE}/api/products`, {
					method: "POST",
					body: formData,
				});
			}

			resetForm();
			setIsCreateModalOpen(false);
			setIsEditModalOpen(false);
			setEditingProduct(null);
			fetchProducts();
		} catch (error) {
			console.error("Error saving product:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (product: any) => {
		setEditingProduct(product);
		setEditingId(product._id);
		setForm({
			name: product.name,
			price: product.price,
			description: product.description || "",
			stock: product.stock,
			categoryId: product.category?._id || "",
			image: null,
		});
		setIsEditModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return;
		await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
		fetchProducts();
	};

	const handleManageVariants = (productId: string) => {
		// For now, just redirect to a new page for managing variants
		window.location.href = `/admin/products/${productId}/variants`;
	};

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4">
			<div className="max-w-7xl mx-auto bg-slate-900/60 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
							<Package className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
							<p className="text-gray-600 dark:text-gray-400">Manage your product inventory</p>
						</div>
					</div>
				</div>

				{/* Stats Card */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-slate-800/40 rounded-2xl p-4 shadow-sm border border-slate-700/40">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Total Products
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{products.length}
								</p>
							</div>
							<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
								<Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
					</div>
					<div className="bg-slate-800/40 rounded-2xl p-4 shadow-sm border border-slate-700/40">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Stock</p>
								<p className="text-3xl font-bold text-green-600 dark:text-green-400">
									{products.filter((p) => p.stock > 0).length}
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
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
								<p className="text-3xl font-bold text-red-600 dark:text-red-400">
									{products.filter((p) => p.stock <= 0).length}
								</p>
							</div>
							<div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
								<Edit2 className="w-6 h-6 text-red-600 dark:text-red-400" />
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
								placeholder="Search products..."
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
							Add Product
						</Button>
					</div>
				</div>

				{/* Products Table */}
				<div className="bg-slate-800/30 rounded-2xl shadow-md border border-slate-700/40 overflow-hidden">
					{filteredProducts.length === 0 ? (
						<div className="p-12 text-center">
							<Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								{searchTerm ? "No products found" : "No products yet"}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-6">
								{searchTerm
									? "Try adjusting your search terms"
									: "Get started by creating your first product"}
							</p>
							{!searchTerm && (
								<Button
									onClick={() => setIsCreateModalOpen(true)}
									className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
									startIcon={<Plus className="w-4 h-4" />}
								>
									Add Your First Product
								</Button>
							)}
						</div>
					) : (
						<Table className="w-full">
							<TableHeader className="bg-slate-800/60">
								<TableRow className="align-middle">
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white px-6 py-4 text-start"
									>
										Product
									</TableCell>
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white px-6 py-4 text-start"
									>
										Price
									</TableCell>
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white px-6 py-4 text-start"
									>
										Stock
									</TableCell>
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white px-6 py-4 text-start"
									>
										Category
									</TableCell>
									<TableCell
										isHeader
										className="font-semibold text-gray-900 dark:text-white text-right px-6 py-4 align-middle"
									>
										Actions
									</TableCell>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredProducts.map((product) => (
									<TableRow
										key={product._id}
										className="hover:bg-slate-700/40 transition-colors border-b border-slate-700/20 align-middle"
									>
										<TableCell className="font-medium text-white px-6 py-5 align-middle">
											<div className="flex items-center gap-3">
												{product.imageUrl && (
													<img
														src={`${API_BASE}${product.imageUrl}`}
														alt={product.name}
														className="w-12 h-12 object-cover rounded-lg"
													/>
												)}
												<div>
													<div className="font-medium">{product.name}</div>
													{product.description && (
														<div className="text-sm text-slate-400 truncate max-w-xs">
															{product.description}
														</div>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell className="text-slate-300 px-6 py-5 align-middle">
											₹{product.price}
										</TableCell>
										<TableCell className="text-slate-300 px-6 py-5 align-middle">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													product.stock > 10
														? "bg-green-900/30 text-green-400"
														: product.stock > 0
														? "bg-yellow-900/30 text-yellow-400"
														: "bg-red-900/30 text-red-400"
												}`}
											>
												{product.stock}
											</span>
										</TableCell>
										<TableCell className="text-slate-300 px-6 py-5 align-middle">
											{product.category?.name || "No category"}
										</TableCell>
										<TableCell className="text-right px-6 py-5 align-middle">
											<div className="flex items-center justify-end gap-3">
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleEdit(product)}
													startIcon={<Edit2 className="w-4 h-4" />}
													className="px-4 py-2 text-blue-300 border-blue-700/40 hover:bg-blue-700/20 rounded-lg transition-all duration-200"
												>
													Edit
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleManageVariants(product._id)}
													startIcon={<Settings className="w-4 h-4" />}
													className="px-4 py-2 text-purple-300 border-purple-700/40 hover:bg-purple-700/20 rounded-lg transition-all duration-200"
												>
													Variants
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleDelete(product._id)}
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

				{/* Create Product Modal */}
				<Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
					<div className="p-6">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
							Add New Product
						</h2>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Product Name *
									</label>
									<input
										name="name"
										value={form.name}
										onChange={handleChange}
										placeholder="Enter product name"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Price *
									</label>
									<input
										name="price"
										value={form.price}
										onChange={handleChange}
										placeholder="0.00"
										type="number"
										step="0.01"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Description
								</label>
								<textarea
									name="description"
									value={form.description}
									onChange={handleChange}
									placeholder="Enter product description"
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Stock
									</label>
									<input
										name="stock"
										value={form.stock}
										onChange={handleChange}
										placeholder="0"
										type="number"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Category *
									</label>
									<select
										name="categoryId"
										value={form.categoryId}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									>
										<option value="">Select Category</option>
										{categories.map((c) => (
											<option key={c._id} value={c._id}>
												{c.name}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Product Image
								</label>
								<div
									className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
										isDragOver
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
											: "border-gray-300 dark:border-gray-600 hover:border-gray-400"
									}`}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
								>
									<input
										type="file"
										id="fileInput"
										onChange={handleFile}
										accept="image/*"
										className="hidden"
									/>
									{imagePreview ? (
										<div className="space-y-4">
											<img
												src={imagePreview}
												alt="Preview"
												className="mx-auto max-w-xs max-h-48 object-cover rounded"
											/>
											<p className="text-sm text-gray-600 dark:text-gray-400">{form.image?.name}</p>
											<button
												type="button"
												onClick={() => document.getElementById("fileInput")?.click()}
												className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
											>
												Change Image
											</button>
										</div>
									) : (
										<div className="space-y-2">
											<div className="text-gray-400 dark:text-gray-500">
												<svg
													className="mx-auto h-12 w-12"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
												>
													<path
														d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>
											<p className="text-gray-600 dark:text-gray-400">
												Drag and drop an image here, or{" "}
												<button
													type="button"
													onClick={() => document.getElementById("fileInput")?.click()}
													className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
												>
													browse
												</button>
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-500">
												PNG, JPG, GIF up to 10MB
											</p>
										</div>
									)}
								</div>
							</div>

							<div className="flex gap-4 pt-4">
								<button
									type="submit"
									disabled={loading}
									className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? "Adding..." : "Add Product"}
								</button>
								<button
									type="button"
									onClick={() => {
										setIsCreateModalOpen(false);
										resetForm();
									}}
									className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 px-6 py-2 rounded-lg font-medium transition-all duration-200"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</Modal>

				{/* Edit Product Modal */}
				<Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
					<div className="p-6">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
							Edit Product
						</h2>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Product Name *
									</label>
									<input
										name="name"
										value={form.name}
										onChange={handleChange}
										placeholder="Enter product name"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Price *
									</label>
									<input
										name="price"
										value={form.price}
										onChange={handleChange}
										placeholder="0.00"
										type="number"
										step="0.01"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Description
								</label>
								<textarea
									name="description"
									value={form.description}
									onChange={handleChange}
									placeholder="Enter product description"
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Stock
									</label>
									<input
										name="stock"
										value={form.stock}
										onChange={handleChange}
										placeholder="0"
										type="number"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Category *
									</label>
									<select
										name="categoryId"
										value={form.categoryId}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									>
										<option value="">Select Category</option>
										{categories.map((c) => (
											<option key={c._id} value={c._id}>
												{c.name}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Product Image
								</label>
								<div
									className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
										isDragOver
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
											: "border-gray-300 dark:border-gray-600 hover:border-gray-400"
									}`}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
								>
									<input
										type="file"
										id="editFileInput"
										onChange={handleFile}
										accept="image/*"
										className="hidden"
									/>
									{imagePreview ? (
										<div className="space-y-4">
											<img
												src={imagePreview}
												alt="Preview"
												className="mx-auto max-w-xs max-h-48 object-cover rounded"
											/>
											<p className="text-sm text-gray-600 dark:text-gray-400">{form.image?.name}</p>
											<button
												type="button"
												onClick={() => document.getElementById("editFileInput")?.click()}
												className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
											>
												Change Image
											</button>
										</div>
									) : editingProduct?.imageUrl ? (
										<div className="space-y-4">
											<img
												src={`${API_BASE}${editingProduct.imageUrl}`}
												alt="Current"
												className="mx-auto max-w-xs max-h-48 object-cover rounded"
											/>
											<p className="text-sm text-gray-600 dark:text-gray-400">Current image</p>
											<button
												type="button"
												onClick={() => document.getElementById("editFileInput")?.click()}
												className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
											>
												Change Image
											</button>
										</div>
									) : (
										<div className="space-y-2">
											<div className="text-gray-400 dark:text-gray-500">
												<svg
													className="mx-auto h-12 w-12"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
												>
													<path
														d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>
											<p className="text-gray-600 dark:text-gray-400">
												Drag and drop an image here, or{" "}
												<button
													type="button"
													onClick={() => document.getElementById("editFileInput")?.click()}
													className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
												>
													browse
												</button>
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-500">
												PNG, JPG, GIF up to 10MB
											</p>
										</div>
									)}
								</div>
							</div>

							<div className="flex gap-4 pt-4">
								<button
									type="submit"
									disabled={loading}
									className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? "Updating..." : "Update Product"}
								</button>
								<button
									type="button"
									onClick={() => {
										setIsEditModalOpen(false);
										resetForm();
									}}
									className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 px-6 py-2 rounded-lg font-medium transition-all duration-200"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</Modal>
			</div>
		</div>
	);
}

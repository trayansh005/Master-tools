"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    image: null as File | null,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", stock: "", categoryId: "", image: null });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("stock", form.stock);
    formData.append("categoryId", form.categoryId);
    if (form.image) {
      formData.append("image", form.image);
    }

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
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      stock: product.stock,
      categoryId: product.category?._id || "",
      image: null,
    });
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
  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Manage Products</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border px-3 py-2 w-full rounded"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="border px-3 py-2 w-full rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border px-3 py-2 w-full rounded"
        />
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          className="border px-3 py-2 w-full rounded"
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-end items-center">
        <input
          type="file"
          id="fileInput"
          onChange={handleFile}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => document.getElementById("fileInput")?.click()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Upload Image
        </button>

        {form.image && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {form.image.name}
          </p>
        )}

        
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-2">Existing Products</h2>
      <ul className="space-y-2">
        {products.map((p) => (
          <li
          key={p._id}
          className="border p-3 rounded flex items-center gap-4 justify-between"
        >
          <div className="flex items-center gap-4">
            {p.imageUrl && (
              <img
                src={`${API_BASE}${p.imageUrl}`}
                alt={p.name}
                className="w-16 h-16 object-cover"
              />
            )}
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">
                ₹{p.price} | {p.stock} in stock
              </div>
              <div className="text-xs text-gray-400">{p.category?.name}</div>
            </div>
          </div>
        
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(p)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => handleManageVariants(p._id)}
              className="bg-purple-600 text-white px-3 py-1 rounded"
            >
              Variants
            </button>
          </div>
        </li>
        
        ))}
      </ul>
    </div>
  );
}

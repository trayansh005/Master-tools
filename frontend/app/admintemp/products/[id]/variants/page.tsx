"use client";

import { use, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";


export default function ProductVariantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    size: "",
    price: "",
    stock: "",
    productId: id
  });

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    fetchProduct();
    fetchVariants();
  }, [id]);

  // Fetch product details
  const fetchProduct = async () => {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    const data = await res.json();
    setProduct(data);
  };

  // Fetch variants
  const fetchVariants = async () => {
    const res = await fetch(`${API_BASE}/api/products/${id}/variants`);
    const data = await res.json();
    setVariants(data);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({ size: "", price: "", stock: "", productId: id });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("size", form.size);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("productId", form.productId);

    if (editingId) {
      // Update
      await fetch(`${API_BASE}/api/products/${id}/variants/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // Create
      await fetch(`${API_BASE}/api/products/${id}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }


    resetForm();
    fetchVariants();
  };

  const handleEdit = (productsVariants: any) => {
    setEditingId(productsVariants._id);
    setForm({
      size: productsVariants.size,
      price: productsVariants.price,
      stock: productsVariants.stock,
      productId: productsVariants.productId || "",
    });
  };

  const handleDelete = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    await fetch(`${API_BASE}/api/products/${id}/variants/${variantId}`, { method: "DELETE" });
    fetchVariants();
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Product Variants" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 mb-6">
          <div className="mb-4" style={{ maxHeight: '750px', overflowY: 'auto' }}>
            <h2 className="text-lg font-semibold mb-2">Existing Products Variants</h2>
            <ul className="space-y-2">
              {variants.map((p) => (
                <li
                  key={p._id}
                  className="border p-3 rounded flex items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{p.size}</div>
                      <div className="text-sm text-gray-500">
                        ₹{p.price} | {p.stock} in stock
                      </div>
                      <div className="text-xs text-gray-400">{p.productId?.name}</div>
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
                  </div>
                </li>
              ))}
            </ul>

          </div>
          <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Add Variants for Product {product ? product.name : "..."}</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="Size"
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
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                type="number"
                className="border px-3 py-2 w-full rounded"
              />
              <div className="flex gap-2 justify-end items-center">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editingId ? "Update Variant" : "Add Variant"}
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
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebarfilter from "@/components/Sidebarfilter";
import { useCart } from "@/contexts/CartContext";

export default function ProductPage() {
  const params = useParams();
  const id = params?.slug;
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  // Fetch product and variants
  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const productRes = await fetch(`${API_BASE}/api/products/${id}`);
        const productData = await productRes.json();
        setProduct(productData);

        const variantRes = await fetch(`${API_BASE}/api/products/${id}/variants`);
        const variantData = await variantRes.json();
        setVariants(variantData);

        // Initialize quantities
        const initialQty: { [key: string]: number } = {};
        variantData.forEach((v: any) => {
          initialQty[v._id] = 1;
        });
        setQuantities(initialQty);
      } catch (err) {
        console.error("Error fetching product or variants", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAddToCart = (variant: any) => {
	const qty = quantities[variant._id] || 1; // get selected quantity
	addToCart({
	  productId: product._id,
    productName: product?.name || "Unknown Product",
	  variantId: variant._id,
	  size: variant.size,
	  price: variant.price,
	  quantity: qty,
	});
	alert(`${qty} x ${product.name} (${variant.size}) added to cart`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="px-2 py-2 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <Sidebarfilter />

        <main>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{product?.name || "product name"}</h1>
            <h2 className="text-lg text-gray-600 mb-4">
              {product?.category?.name || "Uncategorized"}
            </h2>

            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {variants.length > 0 ? (
                  variants.map((variant) => {
                    const isExpanded = expandedVariant === variant._id;
                    const qty = quantities[variant._id];

                    return (
                      <React.Fragment key={variant._id}>
                        {/* Variant row */}
                        <tr
                          onClick={() =>
                            setExpandedVariant(isExpanded ? null : variant._id)
                          }
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          <td className="border p-2">{variant.size}</td>
                          <td className="border p-2">${variant.price}</td>
                          <td className="border p-2">{variant.stock}</td>
                        </tr>

                        {/* Expanded row */}
                        {isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={3} className="p-4">
                              <div className="flex items-center gap-4">
                                <label>
                                  Quantity:
                                  <input
                                    type="number"
                                    min={1}
                                    max={variant.stock}
                                    value={qty}
                                    onChange={(e) =>
                                      setQuantities((prev) => ({
                                        ...prev,
                                        [variant._id]: Number(e.target.value),
                                      }))
                                    }
                                    className="border rounded px-2 py-1 w-20 ml-2"
                                  />
                                </label>
                                <button
                                  onClick={() => handleAddToCart(variant)}
                                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-4">
                      No variants available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

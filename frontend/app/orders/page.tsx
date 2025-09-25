"use client";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

export default function OrdersPage() {
  const { cart, removeFromCart, clearCart, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";


  const handleCheckout = async () => {
    if (!user) {
      alert("You need to be logged in to checkout");
      return;
    }
    const res = await fetch(`${API_BASE}/api/payment/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart,
        customer: { name: `${user.name}`, email: `${user.email}`, userId: `${user.id}` }
      }),
    });

    const data = await res.json();

    if (data.invoiceUrl) {
      window.location.href = data.invoiceUrl; // redirect to payment page
      sessionStorage.removeItem("cart");
    } else {
      console.error("Checkout error:", data);
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Orders ({totalItems} items)</h1>
        {cart.length === 0 ? (
          <div>
            <p className="text-center my-6 text-gray-700 text-lg">No items in your cart.</p>
            <div className="flex justify-center">
              <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
                Back to Catalog
              </Link>
            </div>
          </div>
        ) : (
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Size</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.variantId}>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2">{item.size}</td>
                  <td className="border p-2">${item.price}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">${item.price * item.quantity}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => removeFromCart(item.variantId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {cart.length === 0 ? ("") : (

          <div className="mt-4 flex justify-center gap-4">
            {/* <button
          className="bg-gray-800 text-white px-4 py-2 rounded"
          onClick={clearCart}
          >
          Clear Cart
        </button> */}
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
              Continue Shopping
            </Link>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

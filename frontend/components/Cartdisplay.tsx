"use client";
import { useCart } from "@/contexts/CartContext"; // Adjust path if needed

export default function CartDisplay() {
  const { totalItems, cart, clearCart } = useCart();

  return (
    <div className="fixed top-4 right-4 bg-white border p-4 rounded-lg shadow-md w-64">
      <h2 className="font-bold text-lg mb-2">Cart ({totalItems} items)</h2>

      {cart.length > 0 ? (
        <ul className="mb-2">
          {cart.map((item) => (
            <li key={item.variantId} className="flex justify-between text-sm mb-1">
              <span>{item.productName} (x{item.quantity})</span>
              <span>${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm mb-2">Your cart is empty</p>
      )}

      {cart.length > 0 && (
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      )}
    </div>
  );
}

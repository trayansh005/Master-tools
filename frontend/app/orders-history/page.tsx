"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import Header from "@/components/Header";


interface OrderItem {
  _id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  userId: number;
  total: number;
  paymentId: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/user/${user.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch your orders:", err);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        {Array.isArray(orders) && orders.length === 0 ? (
          <p className="text-center my-6 text-gray-700 text-lg">No orders found.</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Items</th>
                <th className="border p-2">Payment ID</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2">
                    {order.items.map((i) => (
                      <div key={i._id}>
                        {i.productName} ({i.size}) x{i.quantity} – ${i.price}
                      </div>
                    ))}
                  </td>
                  <td className="border p-2">{order.paymentId}</td>
                  <td className="border p-2">${order.total}</td>
                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2">{order.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

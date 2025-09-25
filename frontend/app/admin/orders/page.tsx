"use client";

import { useEffect, useState } from "react";

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
  userId: { _id: string; name: string; email: string } | null;
  total: number;
  paymentId: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders-admin/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
  
      if (!res.ok) throw new Error("Failed to update status");
  
      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders (Admin)</h1>
      {orders.length === 0 ? (
        <p className="text-center my-6 text-gray-700 text-lg">No orders found.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User Name</th>
              <th className="border p-2">User Email</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Payment ID</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.userId?.name || "N/A"}</td>
                <td className="border p-2">{order.userId?.email || "N/A"}</td>
                <td className="border p-2">
                  {order.items.map((i) => (
                    <div key={i._id}>
                      {i.productName} ({i.size}) x{i.quantity} – ${i.price}
                    </div>
                  ))}
                </td>
                <td className="border p-2">${order.total}</td>
                <td className="border p-2">{order.paymentId}</td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">{order.paymentStatus}</td>
                <td className="border p-2">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Arriving">Arriving</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

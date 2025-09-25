"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p>Your payment ID is: {paymentId}</p>
      <p>Thank you for your order. You can now continue shopping or view your orders.</p>
      <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded mt-4 inline-block">
        Back to Home
      </a>
    </div>
  );
}

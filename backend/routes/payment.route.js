import express from "express";
import Order from "../models/Orders.js";

const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const { cart, customer } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!customer || !customer.name || !customer.email) {
      return res.status(400).json({ error: "Customer details are required" });
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Here you call Fatoorah API...
    // (your existing MyFatoorah payment code)
    const API_KEY = process.env.MYFATOORAH_API_KEY;
    const response = await fetch(
      process.env.MYFATOORAH_TEST_MODE === "true"
        ? "https://apitest.myfatoorah.com/v2/SendPayment"
        : "https://api.myfatoorah.com/v2/SendPayment",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CustomerName: customer.name,
          CustomerEmail: customer.email,
          DisplayCurrencyIso: "USD",
          InvoiceValue: total,
          CallBackUrl: "http://localhost:3000/payment-success",
          ErrorUrl: "http://localhost:3000/payment-failed",
          InvoiceItems: cart.map(item => ({
            ItemName: item.productName,
            Quantity: item.quantity,
            UnitPrice: item.price,
          })),
          NotificationOption: "Lnk", // required by Fatoorah
        }),
      }
    );

    const data = await response.json();
    if (!data?.Data?.InvoiceURL) {
      return res.status(500).json({ error: "Failed to create invoice", data });
    }

    // Save order to database
    const order = new Order({
      userId: customer.userId,
      items: cart,
      total,
      paymentStatus: "Pending",
      paymentId: data.Data.InvoiceId,
    });
    await order.save();

    res.json({ invoiceUrl: data.Data.InvoiceURL });
  } catch (err) {
    console.error("Payment checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

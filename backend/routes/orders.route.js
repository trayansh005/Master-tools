// backend/routes/order.route.js
import express from "express";
import Order from "../models/Orders.js";

const router = express.Router();

// Admin: get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User: get orders by email
router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ "userId": req.params.id }).sort({ createdAt: -1 });
    console.log(req.params.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

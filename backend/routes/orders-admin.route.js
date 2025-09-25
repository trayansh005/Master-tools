// routes/orders-admin.route.js
import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/ordersAdmin.Controller.js";

const router = express.Router();

router.get("/orders-admin", getAllOrders);
router.patch("/orders-admin/:id/status", updateOrderStatus);

export default router;

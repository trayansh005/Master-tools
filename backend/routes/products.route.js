import express from "express";
import multer from "multer";
import productsController from "../controllers/products.controller.js";
import ProductVariant from "../models/ProductsVariants.js";
import mongoose from "mongoose";
import ProductsVariants from "../models/ProductsVariants.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", productsController.list);    // List all products
router.get("/:id", productsController.getOne);     // Get single product
router.post("/", upload.single("image"), productsController.create); // Create
router.put("/:id", upload.single("image"), productsController.update); // Update
router.delete("/:id", productsController.remove); // Delete

// Get product with variants
router.get("/:id/variants", async (req, res) => {
  try {
    const variants = await ProductsVariants.find({ productId: req.params.id });
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  

export default router;

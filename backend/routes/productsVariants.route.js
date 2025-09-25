import express from "express";
import productsVariantController from "../controllers/productsVariants.controller.js";

const router = express.Router({ mergeParams: true });

// GET all variants for a product
router.get("/", productsVariantController.list);

// POST new variant
router.post("/", productsVariantController.create);

// UPDATE variant
router.put("/:id", productsVariantController.update);

// DELETE variant
router.delete("/:id", productsVariantController.remove);

export default router;
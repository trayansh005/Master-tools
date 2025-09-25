import express from "express";
import categoriesController from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", categoriesController.list);        // READ
router.post("/", categoriesController.create);     // CREATE
router.put("/:id", categoriesController.update);   // UPDATE
router.delete("/:id", categoriesController.remove); // DELETE

export default router;

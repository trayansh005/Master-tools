import express from "express";
import categoriesController from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", categoriesController.list);
router.post("/", categoriesController.create);

export default router;

import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Logout route
router.post("/logout", authController.logout);

// Get current user route
router.get("/me", authController.getCurrentUser);

export default router;

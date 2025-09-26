import express from "express";
import usersController from "../controllers/users.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", usersController.update);

export default router;
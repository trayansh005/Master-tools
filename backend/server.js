import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";
import { connectToDB } from "./database/db.js";
import authRoutes from "./routes/auth.route.js";
import categoriesRoutes from "./routes/categories.route.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectToDB();

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
	session({
		secret: process.env.SESSION_SECRET || "your-secret-key",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			touchAfter: 24 * 3600, // lazy session update
		}),
		cookie: {
			secure: false, // Set to true in production with HTTPS
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		},
	})
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);

// Test route
app.get("/api/health", (req, res) => {
	res.json({ message: "Backend server is running!" });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

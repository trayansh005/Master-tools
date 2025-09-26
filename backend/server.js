import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";
import { connectToDB } from "./database/db.js";
import authRoutes from "./routes/auth.route.js";
import categoriesRoutes from "./routes/categories.route.js";
import productRoutes from "./routes/products.route.js";
import variantRoutes from "./routes/productsVariants.route.js";
import Category from "./models/Category.js";
import paymentRoutes from "./routes/payment.route.js";
import ordersRoute from "./routes/orders.route.js";
import ordersRouteAdmin from "./routes/orders-admin.route.js";
import users from "./routes/users.route.js";
import path from "path";


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

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, touchAfter: 24 * 3600 }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productRoutes); // Note: productRoutes handles /api/products/:id internally
// Nest under /api/products/:productId/variants
app.use("/api/products/:productId/variants", variantRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", ordersRoute);
app.use("/api", ordersRouteAdmin);
app.use("/api/userdetails/update", users);

// Static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check
app.get("/api/health", (req, res) => res.json({ message: "Backend server is running!" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

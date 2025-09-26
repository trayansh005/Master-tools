import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import { connectToDB } from "./database/db.js";
import authRoutes from "./routes/auth.route.js";
import categoriesRoutes from "./routes/categories.route.js";
import productRoutes from "./routes/products.route.js";
import variantRoutes from "./routes/productsVariants.route.js";
import paymentRoutes from "./routes/payment.route.js";
import ordersRoute from "./routes/orders.route.js";
import ordersRouteAdmin from "./routes/orders-admin.route.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectToDB();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://31.97.75.157:3000",   // server IP
  "https://masterglobalsupplier.com"  // production domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl, mobile apps
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy: ${origin} is not allowed.`), false);
    }
  },
  credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));

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
app.use("/api/products", productRoutes);
app.use("/api/products/:productId/variants", variantRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", ordersRoute);
app.use("/api", ordersRouteAdmin);

// Static files with proper CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// Health check
app.get("/api/health", (req, res) => res.json({ message: "Backend server is running!" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

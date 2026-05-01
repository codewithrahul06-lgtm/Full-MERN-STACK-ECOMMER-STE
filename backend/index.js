const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// DB & Cloudinary
require("./config/cloudinary");
const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const paymentRoutes = require("./routes/paymentsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const otpRoutes = require("./routes/otpRoutes");

// Connect DB
connectDB();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        process.env.FRONTEND_URL
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/otp", otpRoutes);

// ✅ Root route (only once)
app.get("/", (req, res) => {
    res.send("ShopNest Backend is working properly 🚀");
});

// ✅ Production setup (FIXED - no wildcard error)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    // 🔥 Catch all routes safely (NO path-to-regexp error)
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
    });
}

// ❌ No duplicate routes
// ❌ No app.get("*")
// ❌ No app.get("/*")

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 ShopNest Server running on port ${PORT}`);
});
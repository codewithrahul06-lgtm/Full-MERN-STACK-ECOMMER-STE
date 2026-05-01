const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // ✅ missing import

const otpRoutes = require("./routes/otpRoutes");

dotenv.config();

require("./config/cloudinary");

const connectDB = require("./config/db");

const userRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const paymentRoutes = require("./routes/paymentsRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes");

connectDB();

app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", process.env.FRONTEND_URL],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("ShopNest Backend is working properly");
});

app.use("/api/auth", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/otp", otpRoutes);

// ✅ Correct production setup
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("/*", (req, res) => {   // 🔥 FIXED HERE
        res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Your app is running in development mode. API is running...");
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ShopNest Server running on port ${PORT}`);
});
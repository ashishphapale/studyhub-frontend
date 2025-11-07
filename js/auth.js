// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const path = require("path");
const connectDB = require("./config/db");

// ==========================
// Load Environment Variables
// ==========================
dotenv.config();
connectDB();

const app = express();

// ==========================
// Core Middleware
// ==========================
app.use(express.json({ limit: "10mb" }));

// ✅ FIXED CORS — Handles Netlify + Localhost + Preflight OPTIONS
const allowedOrigins = [
  "https://ashishstudyhub.netlify.app", // ✅ your Netlify frontend
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

// ✅ Manually handle CORS for full control (Render-friendly)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // ✅ End preflight requests immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ==========================
// Security & Performance
// ==========================
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// Test Routes
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ StudyHub Backend is Running!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Optional CORS test route
app.get("/api/test-cors", (req, res) => {
  res.json({
    success: true,
    origin: req.headers.origin,
    allowedOrigins,
    message: "CORS configuration working ✅",
  });
});

// ==========================
// API Routes
// ==========================
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// ==========================
// 404 Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ==========================
// Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

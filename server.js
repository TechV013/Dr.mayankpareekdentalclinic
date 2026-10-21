import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import pool from "./backend/config/db.js";
import appointmentRoutes from "./backend/routes/appointmentRoutes.js";
import authRoutes from "./backend/routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Shree Shyam Dental Care API is Running",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS database_test");
    return res.status(200).json({
      success: true,
      message: "Database connection is working.",
      result: rows,
    });
  } catch (error) {
    console.error("Database test error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Serve frontend static files in production (self-hosted / local)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error Handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

const PORT = process.env.PORT || 5000;

// On Vercel the app is exported as a serverless function (see api/index.js);
// listen() is only for local / traditional hosting.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;

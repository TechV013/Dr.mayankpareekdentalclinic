import express from "express";

import {
  loginAdmin,
  getCurrentAdmin,
} from "../controllers/authController.js";

import requireAdminAuth from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Login
|--------------------------------------------------------------------------
*/

router.post("/login", loginAdmin);

/*
|--------------------------------------------------------------------------
| Current Admin
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  requireAdminAuth,
  getCurrentAdmin
);

export default router;
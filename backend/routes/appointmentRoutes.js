import express from "express";
import requireAdminAuth from "../middleware/authMiddleware.js";

import {
  createAppointment,
  getAppointments,
  confirmAppointment,
  rejectAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();


// Create appointment
router.post("/", createAppointment);


// Get all appointments (Admin only)
router.get("/", requireAdminAuth, getAppointments);


// Confirm appointment (Admin only)
router.put("/:id/confirm", requireAdminAuth, confirmAppointment);


// Reject appointment (Admin only)
router.put("/:id/reject", requireAdminAuth, rejectAppointment);


export default router;
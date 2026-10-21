const express = require("express");
const requireAdminAuth = require("../middleware/authMiddleware");

const {
  createAppointment,
  getAppointments,
  confirmAppointment,
  rejectAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();


// Create appointment
router.post("/", createAppointment);


// Get all appointments (Admin only)
router.get("/", requireAdminAuth, getAppointments);


// Confirm appointment (Admin only)
router.put("/:id/confirm", requireAdminAuth, confirmAppointment);


// Reject appointment (Admin only)
router.put("/:id/reject", requireAdminAuth, rejectAppointment);


module.exports = router;
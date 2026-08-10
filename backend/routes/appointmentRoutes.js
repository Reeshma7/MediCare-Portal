import express from "express";

import {
  bookAppointment,
  getMyAppointments,
  payAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getDoctorAppointments,
  doctorActionAppointment,
  verifyPayment,
  patientCancelAppointment,
  getPatientDashboard,
} from "../controllers/appointmentController.js";
import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();
router.put(
  "/patient/cancel/:id",
  protect,
  patientCancelAppointment
);

// ================= PATIENT ROUTES =================

router.post(
  "/book",
  protect,
  bookAppointment
);

router.get(
  "/my-appointments",
  protect,
  getMyAppointments
);

router.put(
  "/pay/:id",
  protect,
  payAppointment
);
router.get(
  "/patient/dashboard",
  protect,
  getPatientDashboard
);


// ================= ADMIN ROUTES =================

router.get(
  "/all",
  protect,
  adminOnly,
  getAllAppointments
);

router.put(
  "/status/:id",
  protect,
  adminOnly,
  updateAppointmentStatus
);
router.put(
  "/payment/:id",
  protect,
  adminOnly,
  verifyPayment
);

// ================= DOCTOR ROUTES =================

// Get logged-in doctor's appointments
router.get(
  "/doctor",
  protect,
  getDoctorAppointments
);

// Doctor confirms/rejects appointment
router.put(
  "/doctor/:id",
  protect,
  doctorActionAppointment
);


export default router;
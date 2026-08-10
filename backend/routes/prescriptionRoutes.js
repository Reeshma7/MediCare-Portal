import express from "express";

import {
  createPrescription,
  getDoctorPrescriptions,
  getAppointmentReason,
  getPatientPrescriptionHistory,
   getMyPrescriptions,
} from "../controllers/prescriptionController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= CREATE PRESCRIPTION =================

router.post(
  "/create",
  protect,
  createPrescription
);

// ================= DOCTOR PRESCRIPTION HISTORY =================

router.get(
  "/doctor-history",
  protect,
  getDoctorPrescriptions
);

// ================= APPOINTMENT REASON =================

router.get(
  "/appointment-reason/:patientId",
  protect,
  getAppointmentReason
);

// ================= PATIENT PREVIOUS PRESCRIPTIONS =================

router.get(
  "/patient-history/:patientId",
  protect,
  getPatientPrescriptionHistory
);
router.get(
  "/my-prescriptions",
  protect,
  getMyPrescriptions
);
export default router;
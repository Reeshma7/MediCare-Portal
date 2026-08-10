import express from "express";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAvailability,
  updateAvailability,
  getDoctorDashboard,
} from "../controllers/doctorController.js";

import {
  getDoctorPatients
} from "../controllers/doctorPatientController.js";


import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  getDoctorDashboard
);


// DOCTOR AVAILABILITY ROUTES
router.get(
  "/availability",
  protect,
  getAvailability
);

router.put(
  "/availability",
  protect,
  updateAvailability
);

router.get(
  "/patients",
  protect,
  getDoctorPatients
);
// ADMIN ROUTES
router.post(
  "/create",
  protect,
  adminOnly,
  upload.single("profileImage"),
  createDoctor
);

router.get(
  "/all",
  protect,
  getDoctors
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getDoctorById
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateDoctor
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteDoctor
);


export default router;
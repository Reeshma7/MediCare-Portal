import express from "express";

import {
  getAdminStats,
  getPatients,
  getAllClaims,
  approveClaim,
  rejectClaim,
  markClaimPaid,
} from "../controllers/adminController.js";

import {
  getAllRefunds,
  approveRefund,
  rejectRefund,
  markRefunded,
} from "../controllers/adminController.js"; // ✅ refund functions added

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

//
// ================= ADMIN STATS =================
//
router.get(
  "/stats",
  protect,
  adminOnly,
  getAdminStats
);

//
// ================= PATIENTS LIST =================
//
router.get(
  "/patients",
  protect,
  adminOnly,
  getPatients
);

//
// ================= DOCTOR EARNINGS CLAIMS =================
//

// Get all doctor claim requests
router.get(
  "/claims",
  protect,
  adminOnly,
  getAllClaims
);

// Approve claim
router.put(
  "/claims/approve/:id",
  protect,
  adminOnly,
  approveClaim
);

// Reject claim
router.put(
  "/claims/reject/:id",
  protect,
  adminOnly,
  rejectClaim
);

// Mark claim as paid
router.put(
  "/claims/pay/:id",
  protect,
  adminOnly,
  markClaimPaid
);

//
// =======================================================
// ================= REFUND ROUTES (ADDED) ===============
// =======================================================
//

// Get all refunds
router.get(
  "/refunds",
  protect,
  adminOnly,
  getAllRefunds
);

// Approve refund
router.put(
  "/refunds/approve/:id",
  protect,
  adminOnly,
  approveRefund
);

// Reject refund
router.put(
  "/refunds/reject/:id",
  protect,
  adminOnly,
  rejectRefund
);

// Mark refund as completed
router.put(
  "/refunds/mark/:id",
  protect,
  adminOnly,
  markRefunded
);

export default router;
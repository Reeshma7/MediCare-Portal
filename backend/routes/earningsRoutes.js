import express from "express";

import {
  getDoctorEarnings,
  claimEarnings,
  getDoctorClaimHistory,
} from "../controllers/earningsController.js";
import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/doctor",
  protect,
  getDoctorEarnings
);

router.post(
  "/claim",
  protect,
  claimEarnings
);
router.get(
  "/claims",
  protect,
  getDoctorClaimHistory
);

export default router;
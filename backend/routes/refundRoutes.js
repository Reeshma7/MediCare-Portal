import express from "express";
import {
  requestRefund,
  getRefundHistory,
} from "../controllers/refundController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", protect, requestRefund);
router.get("/history", protect, getRefundHistory);

export default router;
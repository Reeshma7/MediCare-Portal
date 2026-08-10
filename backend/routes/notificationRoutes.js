import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= GET ALL NOTIFICATIONS =================
router.get("/", protect, getNotifications);

// ================= GET UNREAD COUNT =================
router.get("/unread-count", protect, getUnreadCount);

// ================= MARK SINGLE NOTIFICATION AS READ =================
router.put("/read/:id", protect, markAsRead);

// ================= MARK ALL NOTIFICATIONS AS READ =================
router.put("/read-all", protect, markAllAsRead);

export default router;
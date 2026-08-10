import express from "express";

import {
  registerUser,
  loginUser,
  getMyProfile,
    updateMyProfile,
} from "../controllers/authController.js";

import { protect }
  from "../middleware/authMiddleware.js";

import { upload }
  from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/profile",
  protect,
  getMyProfile
);
router.put(
  "/update-profile",
  protect,
  updateMyProfile
);

export default router;
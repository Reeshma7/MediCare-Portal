import Notification from "../models/Notification.js";
import User from "../models/User.js";
// ================= GET NOTIFICATIONS =================
// (UPDATED: supports doctor + patient)

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
   { doctorId: req.user._id },
   { patientId: req.user._id },
   { adminId: req.user._id }
],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET UNREAD COUNT =================
// (UPDATED: supports both roles)

export const getUnreadCount = async (req, res) => {
  try {
    const unread = await Notification.countDocuments({
      $or: [
   { doctorId: req.user._id },
   { patientId: req.user._id },
   { adminId: req.user._id }
],
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unread,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= MARK ONE AS READ =================
// (UNCHANGED LOGIC - only extended search)

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      $or: [
   { doctorId: req.user._id },
   { patientId: req.user._id },
   { adminId: req.user._id }
],
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= MARK ALL AS READ =================
// (UNCHANGED LOGIC - extended scope)

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
       $or: [
   { doctorId: req.user._id },
   { patientId: req.user._id },
   { adminId: req.user._id }
],
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
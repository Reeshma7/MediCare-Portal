import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import EarningsClaim from "../models/EarningsClaim.js";
import Notification from "../models/Notification.js";
import Refund from "../models/Refund.js"; // ✅ ADDED

// ================= ADMIN DASHBOARD STATS =================
export const getAdminStats = async (req, res) => {
  try {
    const doctors = await User.countDocuments({ role: "doctor" });
    const patients = await User.countDocuments({ role: "patient" });
    const appointments = await Appointment.countDocuments();

    const revenueData = await Appointment.find({
      paymentStatus: "Verified",
    });

    const revenue = revenueData.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    res.json({
      success: true,
      doctors,
      patients,
      appointments,
      revenue,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= PATIENT LIST =================
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({
      role: "patient",
    }).select("-password");

    res.status(200).json({
      success: true,
      patients,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ALL DOCTOR CLAIMS =================
export const getAllClaims = async (req, res) => {
  try {
    const claims = await EarningsClaim.find()
      .populate("doctorId", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      claims,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= APPROVE CLAIM =================
export const approveClaim = async (req, res) => {
  try {
    const claim = await EarningsClaim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    claim.status = "Approved";
    await claim.save();

    await Notification.create({
      doctorId: claim.doctorId,
      title: "Claim Approved",
      message:
        "Your earnings claim has been approved by the administrator.",
    });

    res.status(200).json({
      success: true,
      message: "Claim Approved",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= REJECT CLAIM =================
export const rejectClaim = async (req, res) => {
  try {
    const claim = await EarningsClaim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    claim.status = "Rejected";
    await claim.save();

    await Notification.create({
      doctorId: claim.doctorId,
      title: "Claim Rejected",
      message:
        "Your earnings claim has been rejected by the administrator.",
    });

    res.status(200).json({
      success: true,
      message: "Claim Rejected",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= MARK CLAIM AS PAID =================
export const markClaimPaid = async (req, res) => {
  try {
    const claim = await EarningsClaim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    claim.status = "Paid";
    claim.paymentDate = new Date();

    await claim.save();

    await Notification.create({
      doctorId: claim.doctorId,
      title: "Payment Received",
      message:
        "Your earnings claim has been paid successfully by the administrator.",
    });

    res.status(200).json({
      success: true,
      message: "Payment Completed",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//
// =======================================================
// ================= REFUND MODULE (ADDED) ===============
// =======================================================
//

// ================= GET ALL REFUNDS =================
export const getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate("patientId", "fullName email")
      .populate("doctorId", "fullName")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      refunds,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= APPROVE REFUND =================
export const approveRefund = async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        message: "Refund not found",
      });
    }

    refund.status = "Approved";
    await refund.save();

    await Notification.create({
      doctorId: refund.doctorId,
      title: "Refund Approved",
      message: "Admin approved your refund request.",
    });

    res.status(200).json({
      success: true,
      message: "Refund Approved",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= REJECT REFUND =================
export const rejectRefund = async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        message: "Refund not found",
      });
    }

    refund.status = "Rejected";
    await refund.save();

    await Notification.create({
      doctorId: refund.doctorId,
      title: "Refund Rejected",
      message: "Admin rejected your refund request.",
    });

    res.status(200).json({
      success: true,
      message: "Refund Rejected",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= MARK REFUND AS COMPLETED =================
export const markRefunded = async (req, res) => {
  try {
    const { refundTransactionId } = req.body;

    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        message: "Refund not found",
      });
    }

    refund.status = "Refunded";
    refund.refundTransactionId = refundTransactionId;
    refund.refundDate = new Date();

    await refund.save();

    await Notification.create({
      patientId: refund.patientId,
      title: "Refund Completed",
      message: "Your refund has been processed successfully.",
    });

    res.status(200).json({
      success: true,
      message: "Refund Completed",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
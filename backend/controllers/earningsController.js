import EarningsClaim from "../models/EarningsClaim.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ================= GET DOCTOR ELIGIBLE EARNINGS =================

export const getDoctorEarnings = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
      status: "Completed",
      paymentStatus: "Verified",
      isClaimed: false,
    })
      .populate("patientId", "fullName")
      .sort({
        appointmentDate: -1,
      });

    const totalAmount = appointments.reduce(
      (total, item) => total + item.amount,
      0
    );

    res.status(200).json({
      success: true,
      appointments,
      totalConsultations: appointments.length,
      totalAmount,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= CLAIM EARNINGS =================

export const claimEarnings = async (req, res) => {

  try {

    const appointments = await Appointment.find({
      doctorId: req.user._id,
      status: "Completed",
      paymentStatus: "Verified",
      isClaimed: false,
    });

    if (appointments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No earnings available to claim",
      });
    }

    const totalAmount = appointments.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const claim = await EarningsClaim.create({
      doctorId: req.user._id,
      appointments: appointments.map(
        (item) => item._id
      ),
      totalAmount,
      totalConsultations: appointments.length,
    });

    // ================= DOCTOR NOTIFICATION =================

    await Notification.create({

      doctorId: req.user._id,

      title: "Claim Submitted",

      message:
        "Your earnings claim has been submitted and is pending admin review.",

      type: "Claim",

    });

    // ================= ADMIN NOTIFICATION =================

    const admin = await User.findOne({
      role: "admin",
    });

    if (admin) {

      await Notification.create({

        adminId: admin._id,

        title: "New Earnings Claim",

        message:
          "A doctor has submitted an earnings claim for approval.",

        type: "Claim",

      });

    }

    // ================= MARK APPOINTMENTS CLAIMED =================

    await Appointment.updateMany(
      {
        _id: {
          $in: appointments.map(
            (item) => item._id
          ),
        },
      },
      {
        isClaimed: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      claim,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= DOCTOR CLAIM HISTORY =================

export const getDoctorClaimHistory = async (
  req,
  res
) => {

  try {

    const claims = await EarningsClaim.find({
      doctorId: req.user._id,
    }).sort({
      createdAt: -1,
    });

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
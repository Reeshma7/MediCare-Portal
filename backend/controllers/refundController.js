import Refund from "../models/Refund.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
export const requestRefund = async (req, res) => {
  try {
    const { appointmentId, reason } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const existing = await Refund.findOne({ appointmentId });
    if (existing) {
      return res.status(400).json({ message: "Refund already requested" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    const refund = await Refund.create({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentId: appointment._id,
      amount: appointment.amount,
      paymentTransactionId: appointment.transactionId,
      reason,
      requestedBy: "patient",
      status: "Pending",
    });
    const admin = await User.findOne({ role: "admin" });

if (admin) {
  await Notification.create({
    adminId: admin._id,
    title: "Refund Request",
    message: "A patient has requested a refund.",
    type: "Refund",
  });
  console.log("Admin notification created");
}

    res.status(201).json({
      success: true,
      message: "Refund requested successfully",
      refund,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRefundHistory = async (req, res) => {
  try {
    const refunds = await Refund.find({
      patientId: req.user._id,
    })
      .populate("doctorId", "fullName")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      refunds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const doctorCancelAppointment = async (appointment) => {
  const existing = await Refund.findOne({
    appointmentId: appointment._id,
  });

  if (existing) return;

  await Refund.create({
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    appointmentId: appointment._id,
    amount: appointment.amount,
    paymentTransactionId: appointment.transactionId,
    reason: "Doctor cancelled appointment",
    requestedBy: "doctor",
    status: "Pending",
  });
  const admin = await User.findOne({ role: "admin" });

if (admin) {
  await Notification.create({
    adminId: admin._id,
    title: "Refund Request",
    message: "A doctor cancelled an appointment. Refund approval is required.",
    type: "Refund",
  });
}
};
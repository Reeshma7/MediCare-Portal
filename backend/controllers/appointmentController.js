import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Prescription from "../models/Prescription.js";
import Refund from "../models/Refund.js"; // ✅ NEW (refund system)

// ================= PATIENT DASHBOARD =================

export const getPatientDashboard = async (req, res) => {
  try {
    const patientId = req.user._id;

    const appointments = await Appointment.find({
      patientId,
    })
      .populate(
        "doctorId",
        "fullName doctorDetails"
      )
      .sort({ appointmentDate: 1 });

    const totalAppointments = appointments.length;

    const upcomingAppointments = appointments.filter(
      (item) =>
        item.status !== "Cancelled" &&
        item.status !== "Completed" &&
        new Date(item.appointmentDate) >= new Date()
    );

    const completedAppointments = appointments.filter(
      (item) => item.status === "Completed"
    );

    const prescriptions = await Prescription.find({
      patientId,
    })
      .populate(
        "doctorId",
        "fullName doctorDetails"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalAppointments,
      upcomingCount: upcomingAppointments.length,
      completedCount: completedAppointments.length,
      prescriptionCount: prescriptions.length,
      upcomingAppointments,
      prescriptions,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ================= BOOK APPOINTMENT =================
export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    const doctor = await User.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const availability = doctor.doctorDetails?.availability;

    if (!availability || availability.status === "Unavailable") {
      return res.status(400).json({
        message: "Doctor is unavailable",
      });
    }

    const selectedDay = new Date(appointmentDate).toLocaleDateString(
      "en-US",
      { weekday: "long" }
    );

    if (!availability.availableDays.includes(selectedDay)) {
      return res.status(400).json({
        message: `Doctor is not available on ${selectedDay}`,
      });
    }

    if (
      appointmentTime < availability.startTime ||
      appointmentTime > availability.endTime
    ) {
      return res.status(400).json({
        message: `Doctor is available only from ${availability.startTime} to ${availability.endTime}`,
      });
    }

    const alreadyBooked = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: "Cancelled" },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        message: "This time slot is already booked for this doctor",
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      amount: doctor.doctorDetails?.consultationFee || 0,
    });

    await Notification.create({
      doctorId,
      title: "New Appointment",
      message: "A new patient has booked an appointment with you.",
    });

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= PATIENT APPOINTMENTS =================
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id,
    })
      .populate(
        "doctorId",
        "fullName profileImage doctorDetails"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= PAYMENT =================
export const payAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        message: "Transaction ID is required",
      });
    }

    appointment.paymentStatus = "Submitted";
    appointment.transactionId = transactionId;

    await appointment.save();
    // Notify Admin

const admin = await User.findOne({
  role: "admin",
});

if (admin) {
  await Notification.create({
    adminId: admin._id,
    title: "Payment Submitted",
    message: "A patient has submitted a payment for appointment verification.",
    type: "Appointment",
  });
}

    res.status(200).json({
      success: true,
      message: "Payment Successful",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.paymentStatus = "Verified";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADMIN - ALL APPOINTMENTS =================
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "fullName email")
      .populate("doctorId", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADMIN UPDATE STATUS =================
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = req.body.status;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DOCTOR - MY APPOINTMENTS =================
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
    })
      .populate(
        "patientId",
        "fullName email mobileNumber profileImage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DOCTOR CONFIRM / REJECT / CANCEL =================
export const doctorActionAppointment = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (
      appointment.doctorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    appointment.status = status;
    await appointment.save();

    // ================= CONFIRMED =================

    if (status === "Confirmed") {
    console.log("Creating patient notification...");

try {
  const notification = await Notification.create({
    patientId: appointment.patientId,
    title: "Appointment Confirmed",
    message: "Your appointment has been confirmed by the doctor.",
    type: "Appointment",
  });

  console.log("Notification Saved:", notification);

} catch (err) {
  console.log("Notification Error:", err);
}
    }

    // ================= CANCELLED =================

    if (status === "Cancelled") {

      // Notify Patient
      await Notification.create({
        patientId: appointment.patientId,
        title: "Appointment Cancelled",
        message:
          "Your appointment has been cancelled by the doctor. You are eligible for a refund.",
        type: "Appointment",
      });

      // Create Refund Request Automatically
      const existingRefund = await Refund.findOne({
        appointmentId: appointment._id,
      });

      if (!existingRefund) {
        await Refund.create({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          appointmentId: appointment._id,
          amount: appointment.amount,
          paymentTransactionId: appointment.transactionId,
          reason: "Doctor cancelled the appointment",
          requestedBy: "doctor",
          status: "Pending",
        });
      }

      // Notify Admin
      const admin = await User.findOne({
        role: "admin",
      });

      if (admin) {
        await Notification.create({
          adminId: admin._id,
          title: "Refund Required",
          message:
            "Doctor cancelled an appointment. Refund needs to be processed.",
          type: "Refund",
        });
      }

      // Notify Doctor
      await Notification.create({
        doctorId: appointment.doctorId,
        title: "Refund Request Created",
        message:
          "A refund request has been automatically created for the cancelled appointment.",
        type: "Refund",
      });
    }

    // ================= COMPLETED =================

    if (status === "Completed") {

      const admin = await User.findOne({
        role: "admin",
      });

      if (admin) {
        await Notification.create({
          adminId: admin._id,
          title: "Appointment Completed",
          message: "A doctor has completed an appointment.",
          type: "Appointment",
        });
      }

    }

    res.status(200).json({
      success: true,
      message: `Appointment ${status} Successfully`,
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};




// ================= PATIENT CANCEL APPOINTMENT =================
export const patientCancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Only the patient who booked can cancel
    if (
      appointment.patientId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Already cancelled
    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        message: "Appointment already cancelled",
      });
    }

    // Cancel appointment
    appointment.status = "Cancelled";
    await appointment.save();

    // Create refund request only if payment is verified
    if (appointment.paymentStatus === "Verified") {
      const existingRefund = await Refund.findOne({
        appointmentId: appointment._id,
      });

      if (!existingRefund) {
        await Refund.create({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          appointmentId: appointment._id,
          amount: appointment.amount,
          paymentTransactionId: appointment.transactionId,
          reason: reason || "Patient cancelled appointment",
          requestedBy: "patient",
          status: "Pending",
        });
        const admin = await User.findOne({ role: "admin" });

if (admin) {
  await Notification.create({
    adminId: admin._id,
    title: "New Refund Request",
    message: "A patient has requested a refund.",
    type: "Refund",
  });
}
      }
    }

    // Notify doctor
    await Notification.create({
      doctorId: appointment.doctorId,
      title: "Appointment Cancelled",
      message: "A patient cancelled the appointment.",
      type: "Appointment",
    });

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

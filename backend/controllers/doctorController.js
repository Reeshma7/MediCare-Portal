import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import EarningsClaim from "../models/EarningsClaim.js";
import Notification from "../models/Notification.js";

// CREATE DOCTOR
export const createDoctor = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      password,
      mobileNumber,
      gender,
      address,
      specialization,
      experience,
      consultationFee,
      qualification,
      department,
      about,
    } = req.body;

    const existingDoctor =
      await User.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already exists",
      });
    }

    const doctor = await User.create({
      fullName,
      email,
      password,
      mobileNumber,
      gender,
      address,

      role: "doctor",

      profileImage: req.file
        ? req.file.filename
        : "",

      doctorDetails: {
        specialization,
        experience,
        consultationFee,
        qualification,
        department,
        about,
      },
    });

    res.status(201).json({
      success: true,
      message: "Doctor Created Successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL DOCTORS
export const getDoctors = async (
  req,
  res
) => {
  try {
    const doctors = await User.find({
      role: "doctor",
    });

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE DOCTOR
export const getDoctorById = async (
  req,
  res
) => {
  try {
    const doctor =
      await User.findById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE DOCTOR
export const updateDoctor = async (
  req,
  res
) => {
  try {
    const doctor =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE DOCTOR
export const deleteDoctor = async (
  req,
  res
) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Doctor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET AVAILABILITY
// GET DOCTOR AVAILABILITY

export const getAvailability =
  async (req, res) => {
    try {
      const doctor =
        await User.findById(
          req.user._id
        );

      if (!doctor) {
        return res.status(404).json({
          message: "Doctor not found",
        });
      }

      res.status(200).json({
        success: true,
        availability:
          doctor.doctorDetails
            ?.availability || {
            status: "Available",
            startTime: "09:00",
            endTime: "17:00",
            availableDays: [],
          },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


// UPDATE AVAILABILITY

export const updateAvailability =
  async (req, res) => {
    try {
      const {
        status,
        startTime,
        endTime,
        availableDays,
      } = req.body;

      const doctor =
        await User.findById(
          req.user._id
        );

      if (!doctor) {
        return res.status(404).json({
          message: "Doctor not found",
        });
      }

      doctor.doctorDetails.availability =
        {
          status,
          startTime,
          endTime,
          availableDays,
        };

      await doctor.save();

      res.status(200).json({
        success: true,
        message:
          "Availability Updated Successfully",
        availability:
          doctor.doctorDetails
            .availability,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  // ================= DOCTOR DASHBOARD =================

export const getDoctorDashboard = async (req, res) => {
  try {
    console.log(req.user);

    const today = new Date().toISOString().split("T")[0];

    // Today's Appointments
    const todayAppointments = await Appointment.find({
      doctorId: req.user._id,
      appointmentDate: today,
      status: { $ne: "Cancelled" },
    })
      .populate("patientId", "fullName")
      .sort({ appointmentTime: 1 });

    // Total Patients
    const patientIds = await Appointment.distinct(
      "patientId",
      {
        doctorId: req.user._id,
      }
    );

    // Total Paid Earnings
    const paidClaims = await EarningsClaim.find({
      doctorId: req.user._id,
      status: "Paid",
    });

    const totalEarnings = paidClaims.reduce(
      (sum, claim) => sum + claim.totalAmount,
      0
    );

    // Unread Notifications
    const unreadNotifications =
      await Notification.countDocuments({
        doctorId: req.user._id,
        isRead: false,
      });

    // Upcoming Appointments
    const upcomingAppointments =
      await Appointment.find({
        doctorId: req.user._id,
        appointmentDate: { $gt: today },
        status: { $ne: "Cancelled" },
      })
        .populate("patientId", "fullName")
        .sort({
          appointmentDate: 1,
          appointmentTime: 1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        todayAppointments: todayAppointments.length,
        totalPatients: patientIds.length,
        totalEarnings,
        unreadNotifications,
      },

      todayAppointments,
      upcomingAppointments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
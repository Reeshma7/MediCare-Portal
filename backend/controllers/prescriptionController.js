import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";


// ================= CREATE PRESCRIPTION =================

export const createPrescription = async (
  req,
  res
) => {
  try {
    const prescription =
      await Prescription.create({
        ...req.body,
        doctorId: req.user._id,
      });

    res.status(201).json({
      success: true,
      message:
        "Prescription Created Successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET ALL PRESCRIPTIONS OF DOCTOR =================

// ================= GET ALL PRESCRIPTIONS OF DOCTOR =================

export const getDoctorPrescriptions = async (
  req,
  res
) => {
  try {

    const prescriptions = await Prescription.find({
      doctorId: req.user._id,
    })

      .populate(
        "patientId",
        "fullName gender mobileNumber profileImage"
      )

      .populate(
        "doctorId",
        "fullName doctorDetails"
      )

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      prescriptions,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= GET APPOINTMENT REASON =================

export const getAppointmentReason =
  async (req, res) => {
    try {
      const { patientId } = req.params;

      const appointment =
        await Appointment.findOne({
          patientId,
          doctorId: req.user._id,
        }).sort({
          appointmentDate: -1,
          createdAt: -1,
        });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "No appointment found",
        });
      }

      res.status(200).json({
        success: true,
        reason: appointment.reason,
        appointmentDate:
          appointment.appointmentDate,
        appointmentTime:
          appointment.appointmentTime,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  // ================= GET PATIENT PREVIOUS PRESCRIPTIONS =================

// ================= GET PATIENT PREVIOUS PRESCRIPTIONS =================

export const getPatientPrescriptionHistory = async (
  req,
  res
) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({
      patientId,
    })

      .populate(
        "patientId",
        "fullName gender mobileNumber"
      )

      .populate(
        "doctorId",
        "fullName doctorDetails"
      )

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      prescriptions,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= GET LOGGED-IN PATIENT PRESCRIPTIONS =================

export const getMyPrescriptions = async (req, res) => {
  try {

    const prescriptions = await Prescription.find({
      patientId: req.user._id,
    })

      .populate(
        "doctorId",
        "fullName doctorDetails"
      )

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      prescriptions,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
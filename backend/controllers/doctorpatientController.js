import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";

// ======================
// GET ALL PATIENTS OF DOCTOR
// ======================
export const getDoctorPatients = async (req, res) => {
  try {

    const doctorId = req.user._id;

    const appointments = await Appointment.find({
      doctorId,
    })
      .populate(
        "patientId",
        "fullName gender mobileNumber email address profileImage"
      )
      .sort({ createdAt: -1 });

    const uniquePatients = [];

    for (const app of appointments) {

      const patient = app.patientId;

      const alreadyExists = uniquePatients.find(
        (p) =>
          p._id.toString() ===
          patient._id.toString()
      );

      if (!alreadyExists) {

        const patientAppointments = appointments.filter(
          (a) =>
            a.patientId._id.toString() ===
            patient._id.toString()
        );

        // Count prescriptions for this patient
        const prescriptionCount =
          await Prescription.countDocuments({
            doctorId,
            patientId: patient._id,
          });

        uniquePatients.push({
          ...patient._doc,

          totalAppointments:
            patientAppointments.length,

          lastConsultation:
            patientAppointments[0]
              ?.appointmentDate || "N/A",

          totalPrescriptions:
            prescriptionCount,
        });

      }

    }

    res.status(200).json({
      success: true,
      patients: uniquePatients,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
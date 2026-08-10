import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
  },

  dosage: {
    type: String,
    required: true,
  },

  frequency: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },
});

const prescriptionSchema =
  new mongoose.Schema(
    {
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },

      prescriptionDate: {
        type: Date,
        default: Date.now,
      },

      symptoms: {
        type: String,
        default: "",
      },

      diagnosis: {
        type: String,
        default: "",
      },

      clinicalNotes: {
        type: String,
        default: "",
      },

      advice: {
        type: String,
        default: "",
      },

      medicines: [medicineSchema],

      followUpDate: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Prescription",
  prescriptionSchema
);
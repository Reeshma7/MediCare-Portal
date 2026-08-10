import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
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
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentTransactionId: {
      type: String,
      default: "",
    },

    refundTransactionId: {
      type: String,
      default: "",
    },

    reason: {
      type: String,
      required: true,
    },

    requestedBy: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Refunded"],
      default: "Pending",
    },

    refundDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Refund", refundSchema);
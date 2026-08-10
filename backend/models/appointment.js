import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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

    appointmentDate: {
      type: String,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    paymentStatus: {
  type: String,
  enum: [
    "Pending",
    "Submitted",
    "Verified",
  ],
  default: "Pending",
},

    transactionId: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },
    isClaimed: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

export default mongoose.model(
  "Appointment",
  appointmentSchema
);
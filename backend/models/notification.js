import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Appointment", "Claim", "Refund"],
      default: "Appointment",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
    adminId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
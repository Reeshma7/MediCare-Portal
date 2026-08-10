import mongoose from "mongoose";

const earningsClaimSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    totalConsultations: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Paid",
      ],
      default: "Pending",
    },

    paymentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "EarningsClaim",
  earningsClaimSchema
);
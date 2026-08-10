import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import earningsRoutes from "./routes/earningsRoutes.js";
import prescriptionRoutes
from "./routes/prescriptionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes
from "./routes/appointmentRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads")
);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use(
  "/api/prescriptions",
  prescriptionRoutes
);
app.use(
  "/api/appointments",
  appointmentRoutes
);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/earnings",
  earningsRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/refunds", refundRoutes);
app.get("/", (req, res) => {
  res.send("Doctor Appointment API Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port ${process.env.PORT}`);
});
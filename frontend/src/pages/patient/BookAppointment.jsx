import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";
import axios from "axios";
import "./BookAppointment.css";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const doctor = location.state?.doctor;

  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  // If page refreshed and doctor data missing
  if (!doctor) {
    return (
      <div className="book-page">
        <div className="book-card">
          <h2>Doctor details not found</h2>

          <button
            onClick={() => navigate("/dashboard/doctors")}
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId: id,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard/payment", {
        state: {
          appointmentId:
            res.data.appointment._id,

          amount:
            doctor.doctorDetails
              ?.consultationFee || 0,

          doctorName:
            doctor.fullName,
        },
      });
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Booking Failed"
      );
    }
  };

  return (
    <div className="book-page">
      <div className="book-card">

        <h2>Book Appointment</h2>

        <div className="doctor-info">
          <img
            src={
              doctor.profileImage
                ? `http://localhost:5000/uploads/${doctor.profileImage}`
                : "https://i.pravatar.cc/150"
            }
            alt={doctor.fullName}
          />

          <h3> {doctor.fullName}</h3>

          <p>
            {doctor.doctorDetails?.specialization}
          </p>

          <h4>
            Consultation Fee: ₹
            {doctor.doctorDetails
              ?.consultationFee}
          </h4>
        </div>

        <form
          className="book-form"
          onSubmit={handleSubmit}
        >

          <input
            type="date"
            name="appointmentDate"
            value={
              formData.appointmentDate
            }
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="appointmentTime"
            value={
              formData.appointmentTime
            }
            onChange={handleChange}
            required
          />

          <textarea
            rows="5"
            name="reason"
            placeholder="Reason for Appointment"
            value={formData.reason}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Continue To Payment
          </button>

        </form>

      </div>
    </div>
  );
}

export default BookAppointment;
import { useEffect, useState } from "react";
import axios from "axios";
import "./Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= FETCH =================
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/my-appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CANCEL APPOINTMENT =================
 const cancelAppointment = async (id) => {
  try {
    const reason = prompt("Enter cancellation reason:");

    if (!reason) return;

    await axios.put(
      `http://localhost:5000/api/appointments/patient/cancel/${id}`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Appointment cancelled successfully");
    fetchAppointments();

  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="appointments-page">
      <h2>My Appointments</h2>

      <div className="appointments-grid">
        {appointments.map((item) => (
          <div className="appointment-card" key={item._id}>
            <img
              src={
                item.doctorId?.profileImage
                  ? `http://localhost:5000/uploads/${item.doctorId.profileImage}`
                  : "https://i.pravatar.cc/150"
              }
              alt=""
            />

            <h3> {item.doctorId?.fullName}</h3>

            <p>{item.doctorId?.doctorDetails?.specialization}</p>

            <p>Date: {item.appointmentDate}</p>
            <p>Time: {item.appointmentTime}</p>
            <p>Status: {item.status}</p>
            <p>Payment: {item.paymentStatus}</p>

            {/* ================= CANCEL BUTTON ================= */}
            {(item.status === "Pending" ||
              item.status === "Confirmed") && (
              <button
                className="cancel-btn"
                onClick={() =>
                  cancelAppointment(item._id)
                }
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Appointments;
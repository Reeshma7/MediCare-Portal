import { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorAppointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/doctor",
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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/doctor/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAppointments();

      alert(`Appointment ${status} Successfully`);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="doctor-appointments">

      <h2>My Appointments</h2>

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {appointments.length === 0 ? (

              <tr>
                <td colSpan="8">
                  No Appointments Found
                </td>
              </tr>

            ) : (

              appointments.map((item) => (

                <tr key={item._id}>

                  <td data-label="Patient">
                    {item.patientId?.fullName}
                  </td>

                  <td data-label="Email">
                    {item.patientId?.email}
                  </td>

                  <td data-label="Mobile">
                    {item.patientId?.mobileNumber}
                  </td>

                  <td data-label="Date">
                    {item.appointmentDate}
                  </td>

                  <td data-label="Time">
                    {item.appointmentTime}
                  </td>

                  <td data-label="Status">

                    <span
                      className={`status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td data-label="Payment">
                    {item.paymentStatus}
                  </td>

                  <td data-label="Action">

                    {/* Pending */}

                    {item.status === "Pending" && (
                      <>
                        <button
                          className="confirm-btn"
                          onClick={() =>
                            updateStatus(item._id, "Confirmed")
                          }
                        >
                          Confirm
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateStatus(item._id, "Cancelled")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Confirmed */}

                    {item.status === "Confirmed" && (
                      <button
                        className="complete-btn"
                        onClick={() =>
                          updateStatus(item._id, "Completed")
                        }
                      >
                        Complete
                      </button>
                    )}

                    {/* Completed */}

                    {item.status === "Completed" && (
                      <span className="completed">
                        ✔ Completed
                      </span>
                    )}

                    {/* Cancelled */}

                    {item.status === "Cancelled" && (
                      <span className="cancelled">
                        Cancelled
                      </span>
                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Appointments;
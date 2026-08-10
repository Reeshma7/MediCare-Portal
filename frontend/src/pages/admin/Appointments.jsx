import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAppointments.css";

function AdminAppointments() {
  const [appointments, setAppointments] =
    useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(
        res.data.appointments
      );
    } catch (error) {
      console.log(error);
    }
  };

 

  return (
    <div className="admin-appointments">

      <div className="appointment-header">
        <h2>
          Appointments Management
        </h2>
      </div>

      <div className="table-wrapper">

        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
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
                <td colSpan="7">
                  No Appointments Found
                </td>
              </tr>
            ) : (
              appointments.map((item) => (
                <tr key={item._id}>

                  <td>
                    {item.patientId?.fullName}
                  </td>

                  <td>
                    
                    {item.doctorId?.fullName}
                  </td>

                  <td>
                    {item.appointmentDate}
                  </td>

                  <td>
                    {item.appointmentTime}
                  </td>

                  <td>
                    <span
                      className={`status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {item.paymentStatus}
                  </td>

                  <td>

                    
  <span className={`status ${item.status.toLowerCase()}`}>
    {item.status}
  </span>

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

export default AdminAppointments;
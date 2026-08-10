import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [dashboard, setDashboard] = useState({
    totalAppointments: 0,
    upcomingCount: 0,
    completedCount: 0,
    prescriptionCount: 0,
    upcomingAppointments: [],
    prescriptions: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/patient/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="patient-dashboard">

      <div className="page-title">
        <h2>Patient Dashboard</h2>
        <p>Welcome back, {user.fullName} 👋</p>
      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card blue">
          <h4>Total Appointments</h4>
          <h2>{dashboard.totalAppointments}</h2>
          <span>Appointments Booked</span>
        </div>

        <div className="stat-card green">
          <h4>Upcoming</h4>
          <h2>{dashboard.upcomingCount}</h2>
          <span>Upcoming Consultations</span>
        </div>

        <div className="stat-card orange">
          <h4>Completed</h4>
          <h2>{dashboard.completedCount}</h2>
          <span>Completed Visits</span>
        </div>

        <div className="stat-card red">
          <h4>Prescriptions</h4>
          <h2>{dashboard.prescriptionCount}</h2>
          <span>Total Prescriptions</span>
        </div>

      </div>

      {/* Dashboard Grid */}

      <div className="dashboard-grid">

        <div className="panel">

          <h3>Upcoming Appointments</h3>

          {dashboard.upcomingAppointments.length === 0 ? (
            <p className="empty-text">
              No Upcoming Appointments.
            </p>
          ) : (
            dashboard.upcomingAppointments.map((item) => (
              <div className="list-item" key={item._id}>
                <div>
                  <strong>Dr. {item.doctorId?.fullName}</strong>
                  <small>
                    {item.doctorId?.doctorDetails?.department}
                  </small>
                </div>

                <span>
                  {new Date(
                    item.appointmentDate
                  ).toLocaleDateString()}
                </span>
              </div>
            ))
          )}

        </div>

        <div className="panel">

          <h3>Recent Prescriptions</h3>

          {dashboard.prescriptions.length === 0 ? (
            <p className="empty-text">
              No Prescriptions Available.
            </p>
          ) : (
            dashboard.prescriptions.map((item) => (
              <div className="list-item" key={item._id}>
                <div>
                  <strong>Dr. {item.doctorId?.fullName}</strong>
                  <small>
                    {item.doctorId?.doctorDetails?.department}
                  </small>
                </div>

                <span>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
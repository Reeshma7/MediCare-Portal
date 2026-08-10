import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);

  const token = localStorage.getItem("token");

  // ================= FETCH STATS =================
  const fetchStats = async () => {
    try {
      const res = await axios.get(
  "http://localhost:5000/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH APPOINTMENTS =================
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data.appointments.slice(0, 3));

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAppointments();
  }, []);

  return (
    <div className="admin-dashboard">

      <div className="admin-header-title">
        <h2>Admin Dashboard</h2>
        <p>Welcome back, manage your hospital system</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="admin-stats">

        <div className="stat-card blue">
          <h4>Doctors</h4>
          <h2>{stats.doctors || 0}</h2>
        </div>

        <div className="stat-card green">
          <h4>Patients</h4>
          <h2>{stats.patients || 0}</h2>
        </div>

        <div className="stat-card orange">
          <h4>Appointments</h4>
          <h2>{stats.appointments || 0}</h2>
        </div>

        <div className="stat-card red">
          <h4>Revenue</h4>
          <h2>₹{stats.revenue || 0}</h2>
        </div>

      </div>

      {/* ================= GRID ================= */}
      <div className="admin-grid">

        {/* RECENT APPOINTMENTS */}
        <div className="panel">

          <h3>Recent Appointments</h3>

          {appointments.map((item) => (
            <div className="list-item" key={item._id}>
              <div>
                <strong>{item.doctorId?.fullName}</strong>
                <span>{item.doctorId?.doctorDetails?.specialization}</span>
              </div>
              <small>{item.appointmentDate}</small>
            </div>
          ))}

        </div>

        {/* SYSTEM STATUS */}
        <div className="panel">

          <h3>System Status</h3>

          <div className="status success">✔ All Systems Active</div>
          <div className="status warning">⚠ {appointments.length} Recent Appointments</div>
          <div className="status info">ℹ Backend Connected</div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarCheck,
  FaUsers,
  FaRupeeSign,
  FaBell,
  FaClock,
} from "react-icons/fa";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalEarnings: 0,
    unreadNotifications: 0,
  });

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/doctors/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.stats);
      setTodayAppointments(res.data.todayAppointments);
      setUpcomingAppointments(res.data.upcomingAppointments);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="doctor-dashboard">

      <div className="page-title">
        <h2>Doctor Dashboard</h2>
        <p>Welcome back Doctor 👨‍⚕️</p>
      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card blue">

          <div className="stat-icon">
            <FaCalendarCheck />
          </div>

          <div>
            <h4>Today's Appointments</h4>
            <h2>{stats.todayAppointments}</h2>
          </div>

        </div>

        <div className="stat-card green">

          <div className="stat-icon">
            <FaUsers />
          </div>

          <div>
            <h4>Total Patients</h4>
            <h2>{stats.totalPatients}</h2>
          </div>

        </div>

        <div className="stat-card orange">

          <div className="stat-icon">
            <FaRupeeSign />
          </div>

          <div>
            <h4>Total Earnings</h4>
            <h2>₹{stats.totalEarnings}</h2>
          </div>

        </div>

        <div className="stat-card red">

          <div className="stat-icon">
            <FaBell />
          </div>

          <div>
            <h4>Notifications</h4>
            <h2>{stats.unreadNotifications}</h2>
          </div>

        </div>

      </div>

      {/* Dashboard */}

      <div className="dashboard-grid">

        <div className="panel">

          <h3>Today's Appointments</h3>

          {todayAppointments.length === 0 ? (

            <div className="empty-state">
              No appointments today
            </div>

          ) : (

            todayAppointments.map((item) => (

              <div
                key={item._id}
                className="list-item"
              >

                <div>

                  <h4>{item.patientId?.fullName}</h4>

                  <p>Patient Consultation</p>

                </div>

                <div className="time-box">

                  <FaClock />

                  <span>{item.appointmentTime}</span>

                </div>

              </div>

            ))

          )}

        </div>

        <div className="panel">

          <h3>Upcoming Appointments</h3>

          {upcomingAppointments.length === 0 ? (

            <div className="empty-state">
              No upcoming appointments
            </div>

          ) : (

            upcomingAppointments.map((item) => (

              <div
                key={item._id}
                className="list-item"
              >

                <div>

                  <h4>{item.patientId?.fullName}</h4>

                  <p>
                    {new Date(
                      item.appointmentDate
                    ).toLocaleDateString()}
                  </p>

                </div>

                <div className="time-box">

                  <FaClock />

                  <span>{item.appointmentTime}</span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default DoctorDashboard;
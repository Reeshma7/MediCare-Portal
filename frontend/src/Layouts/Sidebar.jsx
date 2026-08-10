import { useState } from "react";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaFilePrescription,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

import "./layout.css";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <FaBars
          className="menu-icon"
          onClick={() => setOpen(true)}
        />

        <div className="topbar-brand">
          <h3>MediCare</h3>
          <span>Patient Portal</span>
        </div>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="backdrop"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div>
              <h2>MediCare</h2>
              <p>Welcome, {user.fullName || "Patient"}</p>
            </div>
          </div>

          <FaTimes
            className="close"
            onClick={() => setOpen(false)}
          />
        </div>

        <ul className="menu">

          <NavLink
            to="/dashboard"
            end
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <li>
              <FaHome />
              <span>Dashboard</span>
            </li>
          </NavLink>

          <NavLink
            to="/dashboard/doctors"
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <li>
              <FaUserMd />
              <span>Doctors</span>
            </li>
          </NavLink>

          <NavLink
            to="/dashboard/appointments"
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <li>
              <FaCalendarAlt />
              <span>Appointments</span>
            </li>
          </NavLink>

          <NavLink
            to="/dashboard/prescriptions"
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <li>
              <FaFilePrescription />
              <span>My Prescriptions</span>
            </li>
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <li>
              <FaUser />
              <span>Profile</span>
            </li>
          </NavLink>
          </ul>

          <li className="logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </li>

        
      </aside>
    </>
  );
}

export default Sidebar;
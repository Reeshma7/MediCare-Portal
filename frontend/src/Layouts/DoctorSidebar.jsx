import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaPrescriptionBottleAlt,
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function DoctorSidebar({ open, setOpen }) {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {open && (
        <div
          className="backdrop"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <aside
        className={`doctor-sidebar ${
          open ? "open" : ""
        }`}
      >
        {/* Sidebar Header */}

       <div className="sidebar-header">
  <h2>MediCare</h2>

  <button
    className="close-btn"
    onClick={() => setOpen(false)}
  >
    <FaTimes />
  </button>
</div>

        {/* Menu */}

        <ul className="menu">

          <NavLink
            to="/doctor/dashboard"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <li>
              <FaHome />
              Dashboard
            </li>
          </NavLink>

          <NavLink
            to="/doctor/appointments"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <li>
              <FaCalendarAlt />
              Appointments
            </li>
          </NavLink>

          <NavLink
            to="/doctor/patients"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <li>
              <FaUsers />
              Patients
            </li>
          </NavLink>

          <NavLink
            to="/doctor/prescriptions"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <li>
              <FaPrescriptionBottleAlt />
              Prescriptions
            </li>
          </NavLink>

          <NavLink
            to="/doctor/availability"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <li>
              <FaClock />
              Availability
            </li>
          </NavLink>

          <NavLink
            to="/doctor/earnings"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <li>
              <FaMoneyBillWave />
              Earnings
            </li>
          </NavLink>

          <NavLink
            to="/doctor/profile"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >
            <li>
              <FaUser />
              Profile
            </li>
          </NavLink>

        </ul>

        {/* Logout */}

        <div
          className="logout"
          onClick={logout}
        >
          <FaSignOutAlt />
          Logout
        </div>
      </aside>
    </>
  );
}

export default DoctorSidebar;
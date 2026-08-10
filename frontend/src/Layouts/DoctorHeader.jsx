import { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorLayout.css";

function DoctorHeader({ setOpen }) {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  const imageUrl = user.profileImage
    ? `http://localhost:5000/uploads/${user.profileImage}`
    : "https://i.pravatar.cc/150";

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // ================= FETCH NOTIFICATIONS =================

  const fetchNotifications = async () => {

    try {

     const res = await axios.get(
  "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data.notifications);

    } catch (error) {
      console.log(error);
    }

  };

  // ================= FETCH UNREAD COUNT =================

  const fetchUnreadCount = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnread(res.data.unread);

    } catch (error) {
      console.log(error);
    }

  };

  // ================= MARK ONE AS READ =================

  const markAsRead = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/notifications/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
      fetchUnreadCount();

    } catch (error) {
      console.log(error);
    }

  };

  // ================= MARK ALL AS READ =================

  const markAllRead = async () => {

    try {

      await axios.put(
        "http://localhost:5000/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
      fetchUnreadCount();

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <header className="doctor-header">

      <div className="doctor-header-left">

        <button
          className="menu-btn"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>

        <h2 className="header-title">
          Doctor Panel
        </h2>

      </div>

      <div className="doctor-header-right">

        {/* Notification */}

        <div className="notification-wrapper">

          <button
            className="notification-btn"
            onClick={() =>
              setShowPanel(!showPanel)
            }
          >
            🔔

            {unread > 0 && (
              <span className="notification-badge">
                {unread}
              </span>
            )}

          </button>

          {showPanel && (

            <div className="notification-panel">

              <div className="notification-panel-header">

                <h4>Notifications</h4>

                {notifications.length > 0 && (

                  <button
                    className="mark-all-btn"
                    onClick={markAllRead}
                  >
                    Mark All
                  </button>

                )}

              </div>

              {notifications.length === 0 ? (

                <p className="empty-notification">
                  No Notifications
                </p>

              ) : (

                notifications.map((item) => (

                  <div
                    key={item._id}
                    className={`notification-item ${
                      item.isRead
                        ? "read"
                        : "unread"
                    }`}
                    onClick={() =>
                      markAsRead(item._id)
                    }
                  >

                    <h5>{item.title}</h5>

                    <p>{item.message}</p>

                    <small>
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </small>

                  </div>

                ))

              )}

            </div>

          )}

        </div>

        {/* Profile */}

        <div className="doctor-profile">

          <img
            src={imageUrl}
            alt="doctor"
          />

          <div className="doctor-details">

            <h4>
              {user.fullName || "Doctor"}
            </h4>

            <span>Doctor</span>

          </div>

        </div>

      </div>

    </header>

  );

}

export default DoctorHeader;
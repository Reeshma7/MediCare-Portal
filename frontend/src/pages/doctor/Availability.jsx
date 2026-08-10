import { useEffect, useState } from "react";
import axios from "axios";
import "./Availability.css";

function Availability() {
  const [data, setData] = useState({
    status: "Available",
    startTime: "09:00",
    endTime: "17:00",
    availableDays: [],
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/doctors/availability",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Availability:", res.data);

      if (res.data && res.data.availability) {
        setData({
          status:
            res.data.availability.status ||
            "Available",

          startTime:
            res.data.availability.startTime ||
            "09:00",

          endTime:
            res.data.availability.endTime ||
            "17:00",

          availableDays:
            res.data.availability.availableDays ||
            [],
        });
      }
    } catch (error) {
      console.log(
        "Fetch Error:",
        error.response?.data || error
      );
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleDayChange = (day) => {
    if (data.availableDays.includes(day)) {
      setData({
        ...data,
        availableDays:
          data.availableDays.filter(
            (d) => d !== day
          ),
      });
    } else {
      setData({
        ...data,
        availableDays: [
          ...data.availableDays,
          day,
        ],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/doctors/availability",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", res.data);

      alert(
        "Availability Updated Successfully"
      );
    } catch (error) {
      console.log(
        "Save Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="availability-page">
      <div className="availability-card">

        <h2>Manage Availability</h2>

        <form onSubmit={handleSubmit}>

          {/* Status */}

          <div>
            <label>Status</label>

            <select
              name="status"
              value={data.status}
              onChange={handleChange}
            >
              <option value="Available">
                Available
              </option>

              <option value="Unavailable">
                Unavailable
              </option>
            </select>
          </div>

          {/* Time Fields */}

          <div className="time-grid">

            <div>
              <label>Start Time</label>

              <input
                type="time"
                name="startTime"
                value={data.startTime}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>End Time</label>

              <input
                type="time"
                name="endTime"
                value={data.endTime}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Available Days */}

          <div>
            <label className="days-title">
              Available Days
            </label>

            <div className="days-box">

              {days.map((day) => (
                <label key={day}>

                  <input
                    type="checkbox"
                    checked={data.availableDays.includes(
                      day
                    )}
                    onChange={() =>
                      handleDayChange(day)
                    }
                  />

                  {day}

                </label>
              ))}

            </div>
          </div>

          <button type="submit">
            Save Availability
          </button>

        </form>

      </div>
    </div>
  );
}

export default Availability;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Doctors.css";

function Doctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/doctors/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDoctors(res.data.doctors || []);
      setFilteredDoctors(res.data.doctors || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    let updatedDoctors = doctors;

    // Search by doctor name
    if (search) {
      updatedDoctors = updatedDoctors.filter((doctor) =>
        doctor.fullName
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Filter by department
    if (department) {
      updatedDoctors = updatedDoctors.filter(
        (doctor) =>
          doctor.doctorDetails?.department === department
      );
    }

    setFilteredDoctors(updatedDoctors);
  }, [search, department, doctors]);

  const departments = [
    ...new Set(
      doctors.map(
        (doctor) =>
          doctor.doctorDetails?.department
      )
    ),
  ];

  if (loading) {
    return <h2>Loading Doctors...</h2>;
  }

  return (
    <div className="patient-doctors">

      {/* Header */}
      <div className="doctors-top">
        <h2>Find Doctors</h2>

        <div className="filters">

          <input
            type="text"
            placeholder="Search Doctor..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          >
            <option value="">
              All Departments
            </option>

            {departments.map((dept, index) => (
              <option
                key={index}
                value={dept}
              >
                {dept}
              </option>
            ))}

          </select>

        </div>
      </div>

      {/* Doctor Cards */}
      <div className="doctor-grid">

        {filteredDoctors.length === 0 ? (
          <h3>No Doctors Found</h3>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              className="doctor-card"
              key={doctor._id}
            >

              <img
                src={
                  doctor.profileImage
                    ? `http://localhost:5000/uploads/${doctor.profileImage}`
                    : "https://i.pravatar.cc/150"
                }
                alt={doctor.fullName}
                className="doctor-image"
              />

              <h3>{doctor.fullName}</h3>

              <p>
                <strong>Department:</strong>{" "}
                {doctor.doctorDetails?.department}
              </p>

              <p>
                <strong>Specialization:</strong>{" "}
                {doctor.doctorDetails?.specialization}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {doctor.doctorDetails?.experience} Years
              </p>

              <p>
                <strong>Fee:</strong> ₹
                {doctor.doctorDetails?.consultationFee}
              </p>

              {/* UPDATED BUTTON */}
              <button
                className="book-btn"
                onClick={() =>
                  navigate(
                    `/dashboard/book-appointment/${doctor._id}`,
                    {
                      state: {
                        doctor: doctor,
                      },
                    }
                  )
                }
              >
                Book Appointment
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Doctors;
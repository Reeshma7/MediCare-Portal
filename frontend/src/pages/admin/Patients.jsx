import { useEffect, useState } from "react";
import axios from "axios";
import "./Patients.css";

function Patients() {

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/admin/patients",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPatients(res.data.patients);
  };

  return (
    <div className="table-container">

      <h2>Patients Management</h2>

      {patients.length === 0 ? (

        <div className="no-patients">
          No Patients Found
        </div>

      ) : (

        <table className="patient-table">

          <thead>

            <tr>
              <th>Patient Name</th>
              <th>Email Address</th>
              <th>Profile</th>
            </tr>

          </thead>

          <tbody>

            {patients.map((patient) => (

              <tr key={patient._id}>

                <td>{patient.fullName}</td>

                <td>{patient.email}</td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    👤 View Profile
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      {/* Profile Modal */}

      {selectedPatient && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedPatient(null)}
        >

          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>Patient Profile</h2>

            <img
              src={
                selectedPatient.profileImage
                  ? `http://localhost:5000/uploads/${selectedPatient.profileImage}`
                  : "https://i.pravatar.cc/150"
              }
              alt="patient"
              className="profile-image"
            />

            <div className="profile-details">

              <p>
                <strong>Name :</strong>{" "}
                {selectedPatient.fullName}
              </p>

              <p>
                <strong>Email :</strong>{" "}
                {selectedPatient.email}
              </p>

              <p>
                <strong>Mobile :</strong>{" "}
                {selectedPatient.mobileNumber}
              </p>

              <p>
                <strong>Gender :</strong>{" "}
                {selectedPatient.gender}
              </p>

              <p>
                <strong>Address :</strong>{" "}
                {selectedPatient.address}
              </p>

            </div>

            <button
              className="close-btn-profile"
              onClick={() => setSelectedPatient(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Patients;
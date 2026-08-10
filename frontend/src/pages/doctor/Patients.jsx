import { useEffect, useState } from "react";
import axios from "axios";
import "./Patients.css";

function Patients() {
  const [patients, setPatients] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/doctors/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(res.data.patients);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredPatients =
    patients.filter((patient) =>
      patient.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      patient.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      patient.mobileNumber.includes(
        search
      )
    );

  return (
    <div className="doctor-patients">

      <div className="patient-header">
        <h2>My Patients</h2>

        <input
          type="text"
          placeholder="Search by Name, Email, Mobile"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="table-wrapper">
        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Address</th>
              <th>Total Appointments</th>
              <th>Last Consultation</th>
              <th>Prescriptions</th>
            </tr>
          </thead>

          <tbody>

            {filteredPatients.length ===
            0 ? (
              <tr>
                <td colSpan="8">
                  No Patients Found
                </td>
              </tr>
            ) : (
              filteredPatients.map(
                (patient) => (
                  <tr key={patient._id}>

                    <td>
                      {patient.fullName}
                    </td>

                    <td>
                      {patient.gender}
                    </td>

                    <td>
                      {patient.mobileNumber}
                    </td>

                    <td>
                      {patient.email}
                    </td>

                    <td>
                      {patient.address}
                    </td>

                    <td>
                      {
                        patient.totalAppointments
                      }
                    </td>

                    <td>
                      {
                        patient.lastConsultation
                      }
                    </td>

                    <td>
                      {
                        patient.totalPrescriptions
                      }
                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Patients;
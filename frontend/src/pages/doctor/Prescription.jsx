import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Prescription.css";

function Prescription() {
  const navigate = useNavigate();

  // ==========================
  // STATES
  // ==========================

  const [patients, setPatients] = useState([]);
  const [appointmentReason, setAppointmentReason] =
    useState("");

  const [
    previousPrescriptions,
    setPreviousPrescriptions,
  ] = useState([]);
   const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [formData, setFormData] = useState({
    patientId: "",
    symptoms: "",
    diagnosis: "",
    clinicalNotes: "",
    advice: "",
    followUpDate: "",

    medicines: [
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ],
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  // ==========================
  // FETCH DOCTOR PATIENTS
  // ==========================

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

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

  // ==========================
  // FETCH APPOINTMENT REASON
  // ==========================

  const fetchAppointmentReason = async (
    patientId
  ) => {
    if (!patientId) {
      setAppointmentReason("");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/prescriptions/appointment-reason/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointmentReason(
        res.data.reason ||
          "No appointment reason available."
      );
    } catch (error) {
      console.log(error);

      setAppointmentReason(
        "No appointment reason available."
      );
    }
  };

  // ==========================
  // FETCH PREVIOUS PRESCRIPTIONS
  // ==========================

  const fetchPreviousPrescriptions =
    async (patientId) => {
      if (!patientId) {
        setPreviousPrescriptions([]);
        return;
      }

      try {
        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/prescriptions/patient-history/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPreviousPrescriptions(
          res.data.prescriptions
        );
      } catch (error) {
        console.log(error);
        setPreviousPrescriptions([]);
      }
    };

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "patientId") {
      fetchAppointmentReason(value);
      fetchPreviousPrescriptions(value);
    }
  };

  // ==========================
  // HANDLE MEDICINE CHANGE
  // ==========================

  const handleMedicineChange = (
    index,
    e
  ) => {
    const medicines = [
      ...formData.medicines,
    ];

    medicines[index][e.target.name] =
      e.target.value;

    setFormData({
      ...formData,
      medicines,
    });
  };

  // ==========================
  // ADD MEDICINE
  // ==========================

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        {
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: "",
        },
      ],
    });
  };

  // ==========================
  // REMOVE MEDICINE
  // ==========================

  const removeMedicine = (index) => {
    const medicines =
      formData.medicines.filter(
        (_, i) => i !== index
      );

    setFormData({
      ...formData,
      medicines,
    });
  };

  // ==========================
  // FORMAT DATE
  // ==========================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleDateString();
  };
  const openPrescription = (prescription) => {
  setSelectedPrescription(prescription);
  setShowModal(true);
};

const closeModal = () => {
  setSelectedPrescription(null);
  setShowModal(false);
};
  // ==========================
  // SAVE PRESCRIPTION
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/prescriptions/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Prescription Created Successfully"
      );

      setFormData({
        patientId: "",
        symptoms: "",
        diagnosis: "",
        clinicalNotes: "",
        advice: "",
        followUpDate: "",
        medicines: [
          {
            medicineName: "",
            dosage: "",
            frequency: "",
            duration: "",
          },
        ],
      });

      setAppointmentReason("");
      setPreviousPrescriptions([]);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to create prescription"
      );
    }
  };

  // ==========================
  // RETURN STARTS IN PART 2
  // ==========================
  return (
  <div className="prescription-page">
    <div className="prescription-card">

      {/* Header */}

      <div className="prescription-header">

        <button
          type="button"
          className="history-btn"
          onClick={() =>
            navigate("/doctor/prescription-history")
          }
        >
          📄 View Prescription History
        </button>

        <h2>Create Prescription</h2>

      </div>

      <form onSubmit={handleSubmit}>

        {/* Patient */}

        <label>Patient Name</label>

        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Patient
          </option>

          {patients.map((patient) => (
            <option
              key={patient._id}
              value={patient._id}
            >
              {patient.fullName}
            </option>
          ))}
        </select>

        {/* Appointment Reason */}

        <label>
          Appointment Reason
        </label>

        <textarea
          value={appointmentReason}
          rows="3"
          readOnly
          className="reason-box"
        />

        {/* Previous Prescription History */}

        {formData.patientId &&
  previousPrescriptions.length > 0 && (

  <div className="previous-history">

    <h3>Previous Prescriptions</h3>

    {previousPrescriptions.map((prescription) => (

      <div
        key={prescription._id}
        className="history-card"
      >

        <div className="history-header">

          <div>

            <h4>
              👨‍⚕️ {prescription.doctorId?.fullName}
            </h4>

            <span className="doctor-specialization">
              {prescription.doctorId?.specialization}
            </span>

          </div>

          <span className="history-date">
            {formatDate(prescription.createdAt)}
          </span>

        </div>

        <div className="history-body">

          <p>
            <strong>Diagnosis</strong>
            <br />
            {prescription.diagnosis}
          </p>

          <p>
            <strong>Symptoms</strong>
            <br />
            {prescription.symptoms}
          </p>

          <p>
            <strong>Medicines</strong>
            <br />
            {prescription.medicines.length} Medicines
          </p>

        </div>

        <button
          type="button"
          className="view-btn"
          onClick={() => openPrescription(prescription)}
        >
          View Details
        </button>

      </div>

    ))}

  </div>

)}
                {/* Symptoms */}

        <label>Symptoms</label>

        <textarea
          name="symptoms"
          rows="3"
          value={formData.symptoms}
          onChange={handleChange}
          required
        />

        {/* Diagnosis */}

        <label>Diagnosis</label>

        <textarea
          name="diagnosis"
          rows="3"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />

        {/* Clinical Notes */}

        <label>Clinical Notes</label>

        <textarea
          name="clinicalNotes"
          rows="3"
          value={formData.clinicalNotes}
          onChange={handleChange}
        />

        {/* Advice */}

        <label>Advice</label>

        <textarea
          name="advice"
          rows="3"
          value={formData.advice}
          onChange={handleChange}
        />

        {/* Medicines */}

        <h3>Medicines</h3>

        {formData.medicines.map(
          (medicine, index) => (
            <div
              className="medicine-box"
              key={index}
            >
              <input
                type="text"
                placeholder="Medicine Name"
                name="medicineName"
                value={medicine.medicineName}
                onChange={(e) =>
                  handleMedicineChange(
                    index,
                    e
                  )
                }
                required
              />

              <input
                type="text"
                placeholder="Dosage"
                name="dosage"
                value={medicine.dosage}
                onChange={(e) =>
                  handleMedicineChange(
                    index,
                    e
                  )
                }
                required
              />

              <input
                type="text"
                placeholder="Frequency"
                name="frequency"
                value={medicine.frequency}
                onChange={(e) =>
                  handleMedicineChange(
                    index,
                    e
                  )
                }
                required
              />

              <input
                type="text"
                placeholder="Duration"
                name="duration"
                value={medicine.duration}
                onChange={(e) =>
                  handleMedicineChange(
                    index,
                    e
                  )
                }
                required
              />

              {formData.medicines.length >
                1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    removeMedicine(index)
                  }
                >
                  Remove
                </button>
              )}
            </div>
          )
        )}

        <button
          type="button"
          className="add-btn"
          onClick={addMedicine}
        >
          + Add Medicine
        </button>

        {/* Follow Up Date */}

        <label>
          Follow Up Date
        </label>

        <input
          type="date"
          name="followUpDate"
          value={formData.followUpDate}
          onChange={handleChange}
        />

        {/* Save Button */}

        <button
          type="submit"
          className="save-btn"
        >
          Save Prescription
        </button>

      </form>
       {showModal && selectedPrescription && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>Prescription Details</h2>

      <p>
        <strong>Doctor:</strong>{" "}
        {selectedPrescription.doctorId?.fullName || "N/A"}
      </p>

      <p>
        <strong>Specialization:</strong>{" "}
        {selectedPrescription.doctorId?.doctorDetails?.specialization || "N/A"}
      </p>

      <p>
        <strong>Patient:</strong>{" "}
        {selectedPrescription.patientId?.fullName || "N/A"}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {formatDate(selectedPrescription.createdAt)}
      </p>

      <hr />

      <h3>Symptoms</h3>
      <p>{selectedPrescription.symptoms || "N/A"}</p>

      <h3>Diagnosis</h3>
      <p>{selectedPrescription.diagnosis || "N/A"}</p>

      <h3>Clinical Notes</h3>
      <p>{selectedPrescription.clinicalNotes || "N/A"}</p>

      <h3>Advice</h3>
      <p>{selectedPrescription.advice || "N/A"}</p>

      <h3>Medicines</h3>

      <table className="medicine-table">

        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>

        <tbody>

          {selectedPrescription.medicines?.length > 0 ? (

            selectedPrescription.medicines.map(
              (medicine, index) => (

                <tr key={index}>
                  <td>{medicine.medicineName}</td>
                  <td>{medicine.dosage}</td>
                  <td>{medicine.frequency}</td>
                  <td>{medicine.duration}</td>
                </tr>

              )
            )

          ) : (

            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No Medicines
              </td>
            </tr>

          )}

        </tbody>

      </table>

      <button
  type="button"
  className="modal-close-btn"
  onClick={closeModal}
>
  Close
</button>

    </div>

  </div>

)}
    </div>
  </div>
);

}

export default Prescription;
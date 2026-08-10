import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./PatientPrescription.css";

function PatientPrescription() {

  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // =============================
  // FETCH PATIENT PRESCRIPTIONS
  // =============================

  const fetchPrescriptions = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/prescriptions/my-prescriptions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrescriptions(res.data.prescriptions);

    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // FORMAT DATE
  // =============================

  const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  };

  // =============================
  // MODAL
  // =============================

  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closeModal = () => {
    setSelectedPrescription(null);
  };

  // =============================
  // DOWNLOAD PDF
  // =============================

  const downloadPDF = () => {

    if (!selectedPrescription) return;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text("MEDICARE HOSPITAL", 105, y, {
      align: "center",
    });

    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(120);

    doc.text(
      "Official Patient Prescription",
      105,
      y,
      {
        align: "center",
      }
    );

    y += 15;

    doc.line(15, y, 195, y);

    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);

    doc.text(
      `Doctor : ${selectedPrescription.doctorId?.fullName || "-"}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Specialization : ${
        selectedPrescription.doctorId?.doctorDetails?.specialization || "-"
      }`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Patient : ${
        selectedPrescription.patientId?.fullName || "-"
      }`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Date : ${formatDate(selectedPrescription.createdAt)}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Follow Up : ${
        selectedPrescription.followUpDate
          ? formatDate(selectedPrescription.followUpDate)
          : "No Follow Up"
      }`,
      20,
      y
    );

    y += 15;

    doc.setFont(undefined, "bold");
    doc.text("Symptoms", 20, y);

    y += 8;

    doc.setFont(undefined, "normal");
    doc.text(
      selectedPrescription.symptoms || "-",
      20,
      y
    );

    y += 15;

    doc.setFont(undefined, "bold");
    doc.text("Diagnosis", 20, y);

    y += 8;

    doc.setFont(undefined, "normal");
    doc.text(
      selectedPrescription.diagnosis || "-",
      20,
      y
    );

    y += 15;

    doc.setFont(undefined, "bold");
    doc.text("Clinical Notes", 20, y);

    y += 8;

    doc.setFont(undefined, "normal");
    doc.text(
      selectedPrescription.clinicalNotes || "-",
      20,
      y
    );

    y += 15;

    doc.setFont(undefined, "bold");
    doc.text("Advice", 20, y);

    y += 8;

    doc.setFont(undefined, "normal");
    doc.text(
      selectedPrescription.advice || "-",
      20,
      y
    );

    y += 18;

    doc.setFont(undefined, "bold");
    doc.text("Medicines", 20, y);

    y += 10;

    selectedPrescription.medicines?.forEach((medicine, index) => {

      doc.setFont(undefined, "normal");

      doc.text(
        `${index + 1}. ${medicine.medicineName}`,
        20,
        y
      );

      doc.text(medicine.dosage, 80, y);

      doc.text(medicine.frequency, 120, y);

      doc.text(medicine.duration, 165, y);

      y += 8;

    });

    doc.save("Prescription.pdf");

  };

  // =============================
  // PRINT
  // =============================

  const printPrescription = () => {
    window.print();
  };
  return (

  <div className="patient-prescription-page">

    <div className="patient-prescription-card">

      <h1 className="page-title">
        My Prescriptions
      </h1>

      <p className="page-subtitle">
        View, download and print all prescriptions issued by your doctors.
      </p>

      {prescriptions.length === 0 ? (

        <div className="empty-box">

          <h3>No Prescriptions Found</h3>

          <p>
            Your prescriptions will appear here once a doctor creates one.
          </p>

        </div>

      ) : (

        <div className="prescription-list">

          {prescriptions.map((prescription) => (

            <div
              className="prescription-item"
              key={prescription._id}
            >

              <div className="item-header">

                <div>

                  <h3>

                    Dr. {prescription.doctorId?.fullName}

                  </h3>

                  <p className="specialization">

                    {prescription.doctorId?.doctorDetails?.specialization ||
                      "Doctor"}

                  </p>

                </div>

                <div className="date-box">

                  {formatDate(prescription.createdAt)}

                </div>

              </div>

              <div className="summary">

                <div>

                  <span>Diagnosis</span>

                  <p>{prescription.diagnosis}</p>

                </div>

                <div>

                  <span>Symptoms</span>

                  <p>{prescription.symptoms}</p>

                </div>

              </div>

              <button

                className="view-btn"

                onClick={() => openModal(prescription)}

              >

                View Details

              </button>

            </div>

          ))}

        </div>

      )}

      {selectedPrescription && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Prescription Details</h2>

              <button

                className="close-icon"

                onClick={closeModal}

              >

                ✕

              </button>

            </div>

            <div className="info-grid">

              <div className="info-card">

                <span>Doctor</span>

                <h4>

                  Dr. {selectedPrescription.doctorId?.fullName}

                </h4>

              </div>

              <div className="info-card">

                <span>Specialization</span>

                <h4>

                  {selectedPrescription.doctorId?.doctorDetails?.specialization ||
                    "Doctor"}

                </h4>

              </div>

              <div className="info-card">

                <span>Patient</span>

                <h4>

                  {selectedPrescription.patientId?.fullName}

                </h4>

              </div>

              <div className="info-card">

                <span>Date</span>

                <h4>

                  {formatDate(selectedPrescription.createdAt)}

                </h4>

              </div>

              <div className="info-card">

                <span>Follow Up</span>

                <h4>

                  {selectedPrescription.followUpDate
                    ? formatDate(
                        selectedPrescription.followUpDate
                      )
                    : "No Follow Up"}

                </h4>

              </div>

            </div>

            <div className="section">

              <h3>Symptoms</h3>

              <div className="detail-box">

                {selectedPrescription.symptoms}

              </div>

            </div>

            <div className="section">

              <h3>Diagnosis</h3>

              <div className="detail-box">

                {selectedPrescription.diagnosis}

              </div>

            </div>

            <div className="section">

              <h3>Clinical Notes</h3>

              <div className="detail-box">

                {selectedPrescription.clinicalNotes ||
                  "No Clinical Notes"}

              </div>

            </div>

            <div className="section">

              <h3>Advice</h3>

              <div className="detail-box">

                {selectedPrescription.advice ||
                  "No Advice"}

              </div>

            </div>

            <h3 className="medicine-heading">

              Prescribed Medicines

            </h3>

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

                {selectedPrescription.medicines?.map(
                  (medicine, index) => (

                    <tr key={index}>

                      <td>{medicine.medicineName}</td>

                      <td>{medicine.dosage}</td>

                      <td>{medicine.frequency}</td>

                      <td>{medicine.duration}</td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

            <div className="modal-buttons">

              <button

                className="download-btn"

                onClick={downloadPDF}

              >

                Download PDF

              </button>

              <button

                className="print-btn"

                onClick={printPrescription}

              >

                Print

              </button>

              <button

                className="close-btn"

                onClick={closeModal}

              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  </div>

);

}

export default PatientPrescription;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "./PrescriptionHistory.css";

function PrescriptionHistory() {
     const navigate = useNavigate();


  const [prescriptions, setPrescriptions] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [date, setDate] =
    useState("");

  const [selectedPrescription, setSelectedPrescription] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  // ============================
  // FETCH HISTORY
  // ============================

  const fetchHistory = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/prescriptions/doctor-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrescriptions(
        res.data.prescriptions
      );

    } catch (error) {
      console.log(error);
    }
  };

  // ============================
  // SEARCH + FILTER
  // ============================

  const filtered =
    prescriptions.filter((item) => {

      const patientName =
        item.patientId?.fullName || "";

      const matchName =
        patientName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchDate =
        date === ""
          ? true
          : item.createdAt.slice(0, 10) ===
            date;

      return matchName && matchDate;
    });

  // ============================
  // PRINT
  // ============================

  const printPrescription = () => {
    window.print();
  };

  // ============================
  // DOWNLOAD PDF
  // ============================

  const downloadPDF = () => {

    if (!selectedPrescription) return;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text(
      "Medical Prescription",
      20,
      y
    );

    y += 15;

    doc.setFontSize(12);

    doc.text(
      `Patient : ${selectedPrescription.patientId.fullName}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Gender : ${selectedPrescription.patientId.gender}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Mobile : ${selectedPrescription.patientId.mobileNumber}`,
      20,
      y
    );

    y += 15;

    doc.text(
      `Symptoms : ${selectedPrescription.symptoms}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Diagnosis : ${selectedPrescription.diagnosis}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Clinical Notes : ${selectedPrescription.clinicalNotes}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Advice : ${selectedPrescription.advice}`,
      20,
      y
    );

    y += 20;

    doc.text(
      "Medicines",
      20,
      y
    );

    y += 10;

    selectedPrescription.medicines.forEach(
      (medicine) => {

        doc.text(

          `${medicine.medicineName}
 | ${medicine.dosage}
 | ${medicine.frequency}
 | ${medicine.duration}`,

          20,

          y

        );

        y += 10;
      }
    );

    y += 10;

    doc.text(
      `Follow Up : ${selectedPrescription.followUpDate}`,
      20,
      y
    );

    doc.save(
      `${selectedPrescription.patientId.fullName}_Prescription.pdf`
    );
  };

  return (

    <div className="history-page">

      <div className="history-card">

       <div className="history-header">

  <button
    className="back-btn"
    onClick={() => navigate("/doctor/prescriptions")}
  >
    ← Back
  </button>

  <h2>Prescription History</h2>

</div>
        <div className="history-filter">

          <input
            type="text"
            placeholder="Search Patient..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

        </div>

        <table>

          <thead>

            <tr>

              <th>Patient</th>

              <th>Gender</th>

              <th>Mobile</th>

              <th>Diagnosis</th>

              <th>Follow Up</th>

              <th>Date</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.length === 0 ? (

              <tr>

                <td colSpan="7">

                  No Prescription Found

                </td>

              </tr>

            ) : (

              filtered.map((item) => (

                <tr key={item._id}>

                  <td>
                    {item.patientId.fullName}
                  </td>

                  <td>
                    {item.patientId.gender}
                  </td>

                  <td>
                    {item.patientId.mobileNumber}
                  </td>

                  <td>
                    {item.diagnosis}
                  </td>

                  <td>
                    {item.followUpDate}
                  </td>

                  <td>
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() => {

                        setSelectedPrescription(
                          item
                        );

                        setShowModal(true);

                      }}
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>
                {/* ===========================
            PRESCRIPTION DETAILS MODAL
        ============================ */}

        {showModal && selectedPrescription && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h2>Prescription Details</h2>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  ✖
                </button>

              </div>

              <div className="modal-body">

                <h3>Patient Information</h3>

                <p>
                  <strong>Name :</strong>{" "}
                  {selectedPrescription.patientId.fullName}
                </p>

                <p>
                  <strong>Gender :</strong>{" "}
                  {selectedPrescription.patientId.gender}
                </p>

                <p>
                  <strong>Mobile :</strong>{" "}
                  {selectedPrescription.patientId.mobileNumber}
                </p>

                <hr />

                <h3>Consultation Details</h3>

                <p>
                  <strong>Symptoms :</strong>
                  <br />
                  {selectedPrescription.symptoms}
                </p>

                <p>
                  <strong>Diagnosis :</strong>
                  <br />
                  {selectedPrescription.diagnosis}
                </p>

                <p>
                  <strong>Clinical Notes :</strong>
                  <br />
                  {selectedPrescription.clinicalNotes || "N/A"}
                </p>

                <p>
                  <strong>Advice :</strong>
                  <br />
                  {selectedPrescription.advice || "N/A"}
                </p>

                <hr />

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

                    {selectedPrescription.medicines.map(
                      (medicine, index) => (

                        <tr key={index}>

                          <td>
                            {medicine.medicineName}
                          </td>

                          <td>
                            {medicine.dosage}
                          </td>

                          <td>
                            {medicine.frequency}
                          </td>

                          <td>
                            {medicine.duration}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

                <hr />

                <p>

                  <strong>
                    Follow Up Date :
                  </strong>{" "}

                  {selectedPrescription.followUpDate ||
                    "Not Mentioned"}

                </p>

              </div>

              <div className="modal-footer">

                <button
                  className="print-btn"
                  onClick={printPrescription}
                >
                  Print
                </button>

                <button
                  className="pdf-btn"
                  onClick={downloadPDF}
                >
                  Download PDF
                </button>

                <button
                  className="close-modal-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
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

export default PrescriptionHistory;
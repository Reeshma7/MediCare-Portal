import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Earnings.css";

function Earnings() {

  const navigate = useNavigate();

  const [earnings, setEarnings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/earnings/doctor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEarnings(res.data.appointments);
      setTotalAmount(res.data.totalAmount);
      setTotalConsultations(res.data.totalConsultations);

    } catch (error) {
      console.log(error);
    }
  };

  const claimEarnings = async () => {
    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/earnings/claim",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      fetchEarnings();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to claim earnings"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="earnings-page">

      <h2>Doctor Earnings</h2>

      {/* SUMMARY */}

      <div className="earnings-summary">

        <div className="summary-card">

          <h4>Total Consultations</h4>

          <h2>{totalConsultations}</h2>

        </div>

        <div className="summary-card">

          <h4>Total Earnings</h4>

          <h2>₹{totalAmount}</h2>

        </div>

      </div>

      {/* TABLE */}

      <div className="earnings-table">

        <table>

          <thead>

            <tr>

              <th>Patient</th>

              <th>Appointment Date</th>

              <th>Consultation Fee</th>

              <th>Payment Status</th>

              <th>Earnings Status</th>

            </tr>

          </thead>

          <tbody>

            {earnings.length === 0 ? (

              <tr>

                <td colSpan="5">

                  No Eligible Earnings

                </td>

              </tr>

            ) : (

              earnings.map((item) => (

                <tr key={item._id}>

                  <td>{item.patientId?.fullName}</td>

                  <td>{item.appointmentDate}</td>

                  <td>₹{item.amount}</td>

                  <td>{item.paymentStatus}</td>

                  <td>

                    <span className="eligible">

                      Eligible

                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ACTION BUTTONS */}

      <div className="earnings-actions">

        <button
          className="history-btn"
          onClick={() =>
            navigate("/doctor/claim-history")
          }
        >
          Claim History
        </button>

        {earnings.length > 0 && (

          <button
            className="claim-btn"
            onClick={claimEarnings}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Claim Earnings"}
          </button>

        )}

      </div>

    </div>

  );

}

export default Earnings;
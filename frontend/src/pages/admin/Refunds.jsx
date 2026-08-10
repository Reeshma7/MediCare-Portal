import { useEffect, useState } from "react";
import axios from "axios";
import "./Refunds.css";

function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [txnIds, setTxnIds] = useState({});

  const token = localStorage.getItem("token");

  // ================= FETCH REFUNDS =================
  const fetchRefunds = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/refunds",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefunds(res.data.refunds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  // ================= APPROVE / REJECT =================
  const handleAction = async (id, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/refunds/${action}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Refund ${action}ed successfully`);
      fetchRefunds();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // ================= MARK REFUNDED =================
  const markRefunded = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/refunds/mark/${id}`,
        {
          refundTransactionId: txnIds[id] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Refund completed");
      fetchRefunds();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="refund-page">
      <h2>Refund Management</h2>

      <div className="refund-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {refunds.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">
                  No Refund Requests Found
                </td>
              </tr>
            ) : (
              refunds.map((r) => (
                <tr key={r._id}>
                  <td>{r.patientId?.fullName}</td>
                  <td>{r.doctorId?.fullName}</td>
                  <td>₹{r.amount}</td>
                  <td>{r.reason}</td>
                  <td>{r.paymentTransactionId}</td>

                  <td>
                    <span className={`status ${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>

                  <td>
                    {/* PENDING */}
                    {r.status === "Pending" && (
                      <div className="btn-group">
                        <button
                          className="btn approve"
                          onClick={() =>
                            handleAction(r._id, "approve")
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn reject"
                          onClick={() =>
                            handleAction(r._id, "reject")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* APPROVED → MARK REFUND */}
                    {r.status === "Approved" && (
                      <div className="refund-box">
                        <input
                          type="text"
                          placeholder="Refund Transaction ID"
                          value={txnIds[r._id] || ""}
                          onChange={(e) =>
                            setTxnIds({
                              ...txnIds,
                              [r._id]: e.target.value,
                            })
                          }
                        />

                        <button
                          className="btn refund"
                          onClick={() => markRefunded(r._id)}
                        >
                          Mark Refunded
                        </button>
                      </div>
                    )}

                    {/* COMPLETED */}
                    {r.status === "Refunded" && (
                      <span className="done">Completed</span>
                    )}

                    {/* REJECTED */}
                    {r.status === "Rejected" && (
                      <span className="rejected">Rejected</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Refunds;
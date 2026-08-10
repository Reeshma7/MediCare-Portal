import { useEffect, useState } from "react";
import axios from "axios";
import "./EarningsClaims.css";

function EarningsClaims() {
  const [claims, setClaims] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/claims",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClaims(res.data.claims);

    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
  try {

    let url = "";

    if (status === "Approved") {
      url = `http://localhost:5000/api/admin/claims/approve/${id}`;
    }

    else if (status === "Rejected") {
      url = `http://localhost:5000/api/admin/claims/reject/${id}`;
    }

    else if (status === "Paid") {
      url = `http://localhost:5000/api/admin/claims/pay/${id}`;
    }

    const res = await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    fetchClaims();

  } catch (error) {

    console.log(error.response);

    alert(
      error.response?.data?.message ||
      error.message
    );

  }
};

  return (
    <div className="claims-page">

      <h2>Doctor Earnings Claims</h2>

      <div className="claims-table">

        <table>

          <thead>
            <tr>
              <th>Doctor</th>
              <th>Claim Date</th>
              <th>Amount</th>
              <th>Consultations</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {claims.length === 0 ? (

              <tr>
                <td colSpan="6">
                  No Claims Found
                </td>
              </tr>

            ) : (

              claims.map((claim) => (

                <tr key={claim._id}>

                  <td>
                    {claim.doctorId?.fullName}
                  </td>

                  <td>
                    {new Date(
                      claim.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    ₹{claim.totalAmount}
                  </td>

                  <td>
                    {claim.totalConsultations}
                  </td>

                  <td>

                    <span
                      className={`status ${claim.status.toLowerCase()}`}
                    >
                      {claim.status}
                    </span>

                  </td>

                  <td>

                    {claim.status ===
                    "Pending" ? (

                      <>
                        <button
                          className="approve-btn"
                          onClick={() =>
                            updateStatus(
                              claim._id,
                              "Approved"
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateStatus(
                              claim._id,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </>

                    ) : claim.status ===
                      "Approved" ? (

                      <button
                        className="paid-btn"
                        onClick={() =>
                          updateStatus(
                            claim._id,
                            "Paid"
                          )
                        }
                      >
                        Mark Paid
                      </button>

                    ) : (

                      claim.status

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

export default EarningsClaims;
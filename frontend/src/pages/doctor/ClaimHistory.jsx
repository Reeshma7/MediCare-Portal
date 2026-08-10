import { useEffect, useState } from "react";
import axios from "axios";
import "./ClaimHistory.css";

function ClaimHistory() {

  const [claims, setClaims] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/earnings/claims",
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

  return (
    <div className="claim-history">

      <h2>Claim History</h2>

      <table>

        <thead>

          <tr>

            <th>Claim Date</th>

            <th>Amount</th>

            <th>Consultations</th>

            <th>Status</th>

            <th>Payment Date</th>

          </tr>

        </thead>

        <tbody>

          {claims.length === 0 ? (

            <tr>

              <td colSpan="5">

                No Claims Found

              </td>

            </tr>

          ) : (

            claims.map((claim) => (

              <tr key={claim._id}>

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

                  {claim.status}

                </td>

                <td>

                  {claim.paymentDate
                    ? new Date(
                        claim.paymentDate
                      ).toLocaleDateString()
                    : "-"}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default ClaimHistory;
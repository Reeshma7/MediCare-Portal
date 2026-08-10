import { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentManagement.css";

function PaymentManagement() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(res.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/payment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment Verified Successfully");

      fetchPayments();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Verification Failed"
      );
    }
  };

  return (
    <div className="payment-management">

      <div className="payment-header">
        <h2>Payment Management</h2>
      </div>

      <div className="payment-table">

        <table>

          <thead>

            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {payments.length === 0 ? (

              <tr>
                <td colSpan="8">
                  No Payments Found
                </td>
              </tr>

            ) : (

              payments.map((item) => (

                <tr key={item._id}>

                  <td>{item.patientId?.fullName}</td>

                  <td>{item.doctorId?.fullName}</td>

                  <td>{item.appointmentDate}</td>

                  <td>{item.appointmentTime}</td>

                  <td>₹{item.amount}</td>

                  <td>
                    {item.transactionId || "-"}
                  </td>

                  <td>

                    <span
                      className={`status ${item.paymentStatus.toLowerCase()}`}
                    >
                      {item.paymentStatus}
                    </span>

                  </td>

                  <td>

                    {item.paymentStatus ===
                    "Submitted" ? (

                      <button
                        className="verify-btn"
                        onClick={() =>
                          verifyPayment(item._id)
                        }
                      >
                        Verify
                      </button>

                    ) : item.paymentStatus ===
                      "Verified" ? (

                      <span className="verified">
                        ✔ Verified
                      </span>

                    ) : (

                      <span className="pending">
                        Pending
                      </span>

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

export default PaymentManagement;
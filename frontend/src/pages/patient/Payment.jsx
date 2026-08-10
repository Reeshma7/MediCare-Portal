import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const amount =
    location.state?.amount || 0;

  const appointmentId =
    location.state?.appointmentId;

  const [transactionId, setTransactionId] =
    useState("");

  const upiId = "admin@oksbi";

  const upiLink =
    `upi://pay?pa=${upiId}` +
    `&pn=MediCare Hospital` +
    `&am=${amount}` +
    `&cu=INR`;

  const handlePayment = async () => {
    if (!transactionId.trim()) {
      alert(
        "Please enter Transaction ID"
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/pay/${appointmentId}`,
        {
          transactionId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert("Payment Successful");

      navigate(
        "/dashboard/appointments"
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Payment Failed"
      );
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">

        <h2>Scan & Pay</h2>

        <QRCode
          value={upiLink}
          size={220}
        />

        <h3>
          Consultation Fee: ₹{amount}
        </h3>

        <p>
          Scan using GPay, PhonePe
          or Paytm
        </p>

        <h4>
          UPI ID: {upiId}
        </h4>

        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={transactionId}
          onChange={(e) =>
            setTransactionId(
              e.target.value
            )
          }
        />

        <button
          onClick={handlePayment}
        >
          I Have Paid
        </button>

      </div>
    </div>
  );
}

export default Payment;
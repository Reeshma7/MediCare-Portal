import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Prescription from "./pages/doctor/Prescription";
import PatientLayout from "./layouts/PatientLayout";
import AdminLayout from "./layouts/AdminLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorPatients
from "./pages/doctor/Patients";
import PatientDashboard from "./pages/patient/Dashboard";
import PrescriptionHistory from "./pages/doctor/PrescriptionHistory";
import Doctors from "./pages/patient/Doctors";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientPrescription from "./pages/patient/PatientPrescription";
import Payment from "./pages/patient/Payment";
import Appointments from "./pages/patient/Appointments";
import PatientProfile from "./pages/patient/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Earnings from "./pages/doctor/Earnings";
import Patients from "./pages/admin/Patients";
import ClaimHistory from "./pages/doctor/ClaimHistory";
import PaymentManagement from "./pages/admin/PaymentManagement";
import AddDoctor from "./pages/admin/AddDoctor";
import DoctorList from "./pages/admin/DoctorList";
import Refunds from "./pages/admin/Refunds";

import EditDoctor from "./pages/admin/EditDoctor";
import AdminAppointments from "./pages/admin/Appointments";
import EarningsClaims from "./pages/admin/EarningsClaims";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Profile from "./pages/doctor/Profile";
import DoctorAppointments from "./pages/doctor/Appointments";
import Availability from "./pages/doctor/Availability";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PATIENT ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roleRequired="patient">
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<PatientDashboard />}
          />

          <Route
            path="doctors"
            element={<Doctors />}
          />

          <Route
            path="book-appointment/:id"
            element={<BookAppointment />}
          />
          <Route
  path="payment"
  element={<Payment />}
/>
<Route
  path="/dashboard/prescriptions"
  element={<PatientPrescription />}
/>
           <Route
  path="profile"
  element={<PatientProfile />}
/>
           <Route
    path="appointments"
    element={<Appointments />}
  />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="doctors"
            element={<DoctorList />}
          />

          <Route
            path="doctors/add"
            element={<AddDoctor />}
          />

          <Route
            path="doctors/edit/:id"
            element={<EditDoctor />}
          />
          <Route
  path="patients"
  element={<Patients />}
/>
         <Route
  path="appointments"
  element={<AdminAppointments />}

/>  
<Route
    path="payments"
    element={<PaymentManagement />}
/>
<Route
  path="refunds"
  element={<Refunds />}
/>
<Route
  path="earnings-claims"
  element={<EarningsClaims />}
/>
        </Route>

        {/* ================= DOCTOR ================= */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute roleRequired="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<DoctorDashboard />}
          />
          <Route
  path="appointments"
  element={<DoctorAppointments />}
/>
          <Route
  path="availability"
  element={<Availability />}
/>
            <Route
  path="patients"
  element={<DoctorPatients />}
/>
<Route
  path="/doctor/prescriptions"
  element={<Prescription />}
/>
<Route
    path="/doctor/prescription-history"
    element={<PrescriptionHistory/>}
/>
<Route
  path="earnings"
  element={<Earnings />}
/>
<Route
  path="claim-history"
  element={<ClaimHistory />}
/>
          <Route
            path="profile"
            element={<Profile />}
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<h1>404 NOT FOUND</h1>}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
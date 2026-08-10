import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE PROFILE
  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        {
          fullName: user.fullName,
          mobileNumber: user.mobileNumber,
          gender: user.gender,
          address: user.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      // Update localStorage user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      fetchProfile();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Update Failed"
      );
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h2>My Profile</h2>

        <div className="profile-image-box">
          <img
            src={
              user.profileImage
                ? `http://localhost:5000/uploads/${user.profileImage}`
                : "https://i.pravatar.cc/200"
            }
            alt="Profile"
          />
        </div>

        <form onSubmit={updateProfile}>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={user.email}
            disabled
          />

          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={user.mobileNumber}
            onChange={handleChange}
            required
          />

          <label>Gender</label>
          <input
            type="text"
            name="gender"
            value={user.gender}
            onChange={handleChange}
            required
          />

          <label>Address</label>
          <textarea
            name="address"
            value={user.address}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Update Profile
          </button>

        </form>

      </div>
    </div>
  );
}

export default Profile;
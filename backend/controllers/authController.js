import User from "../models/User.js";

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      gender,
      address,
      password,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      gender,
      address,
      password,
      profileImage: req.file
        ? req.file.filename
        : "",
    });

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ================= LOGIN USER =================
export const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
      role,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // ================= ROLE VALIDATION =================

    if (user.role !== role) {

      return res.status(403).json({
        success: false,
        message:
          "Invalid role selected. Please choose the correct account type and try again.",
      });

    }

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });

  }

};

// ================= GET MY PROFILE =================
export const getMyProfile = async (req, res) => {

  try {

    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};

// ================= UPDATE PROFILE =================
export const updateMyProfile = async (
  req,
  res
) => {

  try {

    const {
      fullName,
      mobileNumber,
      gender,
      address,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    user.fullName =
      fullName || user.fullName;

    user.mobileNumber =
      mobileNumber ||
      user.mobileNumber;

    user.gender =
      gender || user.gender;

    user.address =
      address || user.address;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Profile Updated Successfully",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* ===========================
   Register User
=========================== */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ===========================
   Login User
=========================== */



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // Find User
    const user = await User.findOne({ email });
    console.log("Email received:", email);
console.log("User found:", user);


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

    // Generate JWT Token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const googleLogin = async (req, res) => {

  try {

    const {

      name,

      email,

      photo,

    } = req.body;

    if (!email) {

      return res.status(400).json({

        success: false,

        message: "Email is required",

      });

    }

    let user = await User.findOne({

      email,

    });

    if (!user) {

      const randomPassword = crypto
        .randomBytes(20)
        .toString("hex");

      const hashedPassword =
        await bcrypt.hash(
          randomPassword,
          10
        );

      user = await User.create({

        name,

        email,

        password: hashedPassword,

        avatar: photo || "",

      });

    }

    const token = generateToken(user._id);

    return res.status(200).json({

      success: true,

      message: "Google Login Successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

      },

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

};

export {

  registerUser,

  loginUser,

  googleLogin,

};
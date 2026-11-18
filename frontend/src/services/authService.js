import axios from "axios";

const API = axios.create({

  baseURL: "http://localhost:5000/api",

});

// ==========================
// Register
// ==========================

export const registerUser = async (userData) => {

  const response = await API.post(

    "/auth/register",

    userData

  );

  return response.data;

};

// ==========================
// Login
// ==========================

export const loginUser = async (userData) => {

  const response = await API.post(

    "/auth/login",

    userData

  );

  return response.data;

};

// ==========================
// Google Login
// ==========================

export const googleLogin = async (userData) => {

  const response = await API.post(

    "/auth/google",

    userData

  );

  return response.data;

};
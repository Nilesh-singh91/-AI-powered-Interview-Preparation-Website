import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  googleLogin,
} from "../services/authService";

import googlePopupLogin from "../services/googleAuthService";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      // Validate JWT is not expired
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          // Clear stale session
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Malformed token — clear
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);

  }, []);

  const login = (userData, token) => {

    localStorage.setItem("user", JSON.stringify(userData));

    localStorage.setItem("token", token);

    setUser(userData);

  };




  const emailLogin = async (email, password) => {

  try {

    setAuthLoading(true);

    const data = await loginUser({

      email,

      password,

    });

    localStorage.setItem(

      "token",

      data.token

    );

    localStorage.setItem(

      "user",

      JSON.stringify(data.user)

    );

    setUser(data.user);

    return data;

  } finally {

    setAuthLoading(false);

  }

};



const emailRegister = async (

  name,

  email,

  password

) => {

  setAuthLoading(true);

  try {

    const data = await registerUser({

      name,

      email,

      password,

    });

    return data;

  } finally {

    setAuthLoading(false);

  }

};


const googleSignIn = async () => {

  try {

    setAuthLoading(true);

    // Firebase Popup
    const firebaseUser = await googlePopupLogin();

    // Backend API
    const data = await googleLogin({

      name: firebaseUser.displayName,

      email: firebaseUser.email,

      photo: firebaseUser.photoURL,

    });

    // Save Token
    localStorage.setItem(

      "token",

      data.token

    );

    // Save User
    localStorage.setItem(

      "user",

      JSON.stringify(data.user)

    );

    setUser(data.user);

    return data;

  } finally {

    setAuthLoading(false);

  }

};

  const logout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setUser(null);

  };

  return (

    <AuthContext.Provider
  value={{
  user,

  loading,

  authLoading,

  login,

  emailLogin,

  emailRegister,

  googleSignIn,

  logout,
}}
>

      {children}

    </AuthContext.Provider>

  );

};

export default AuthProvider;
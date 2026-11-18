import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {

  const { user, loading } = useAuth();

  // Wait until AuthContext finishes loading
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // If user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in
  return children;
};

export default ProtectedRoute;
import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-white to-indigo-100 relative">

      {/* Background Blur Circle 1 */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl"></div>

      {/* Background Blur Circle 2 */}
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <LoginForm />
      </motion.div>

    </div>
  );
};

export default Login;
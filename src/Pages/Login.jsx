import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        emailOrUsername: username,
        password,
      });

      toast.success("Login successful!", { position: "top-right" });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setTimeout(() => navigate("/home"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <ToastContainer />

      {/* Main Card */}
      <div className="w-[90%] max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <img className="w-20 mx-auto drop-shadow-sm" src="/logo.png" alt="LibGo" />
          
          <h1 className="text-3xl font-bold text-red-800 tracking-wide mt-2">
            LibGo
          </h1>

          <p className="text-gray-500 mt-1">
            Login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Username / Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              Username / Email
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} />
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="border border-gray-300 rounded-lg p-3 pr-12 bg-gray-50 
                           focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-gray-800 text-white font-semibold py-3 rounded-lg w-full 
                       hover:bg-black transition-all duration-200 shadow-sm 
                       flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faSignInAlt} />
            Login
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-gray-700 hover:underline"
          >
            Forgot Password?
          </button>

          <p className="text-sm text-gray-700">
            New user?{" "}
            <a href="/register" className="text-red-800 font-medium hover:underline">
              Register
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;

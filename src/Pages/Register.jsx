import { useState } from "react";
import axios from "axios";
import "../App.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        fullName,
        email,
        username,
        password,
        cpassword,
      });
      toast.success(res.data.message, {
        position: "top-center",
      });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-6"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUserPlus} className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Register</h1>
          <p className="text-gray-500 text-sm mt-2">
            Create an account to access your digital library
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              Full Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} />
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              Username
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} />
              Password
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} />
              Confirm Password
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              type="password"
              placeholder="Confirm your password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
          </div>
        </div>

        <button
          className="mt-4 bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg w-full hover:bg-black transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
          type="submit"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Register
        </button>

        <p className="text-gray-600 text-sm text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-gray-800 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
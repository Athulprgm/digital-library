import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      toast.success("Password changed successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer />
      <div className="w-[90%] max-w-md bg-white p-8 border rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create New Password
        </h2>

        <form onSubmit={handleReset} className="mt-6 flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-gray-800 text-white py-3 rounded-lg hover:bg-black"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

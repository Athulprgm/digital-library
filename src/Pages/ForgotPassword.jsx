import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        username,
      });

      toast.success("Password reset link sent to the email linked with this username!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer />
      <div className="w-[90%] max-w-md bg-white rounded-xl shadow-sm p-8 border">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="border p-3 rounded-lg"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            type="submit"
            className="bg-gray-800 text-white py-3 rounded-lg hover:bg-black"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

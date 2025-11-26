import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import ProfileToastNotification from "../Components/ProfileToastNotification";
import { toast } from "react-toastify";



function ProfilePage() {
  const API = "http://localhost:5000";
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [User, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    photo: "",
  });

  // --------------------------
  // LOAD PROFILE
  // --------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API}/api/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setProfile({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            address: data.address || "",
            photo: data.photo || "",
          });
          toast.success("Profile loaded successfully!", { position: "top-right" });
        } else {
          toast.error(data.message || "Failed to load profile", { position: "top-right" });
        }
      } catch (err) {
        toast.error("Error loading profile: " + err.message, { position: "top-right" });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, API]);

  const handleChange = (e) => {
    setProfile({ ...User, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setSelectedPhotoFile(file);
    setProfile({ ...User, photo: URL.createObjectURL(file) });
  };

  // --------------------------
  // SAVE PROFILE
  // --------------------------
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const profileRes = await fetch(`${API}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: User.fullName,
          phone: User.phone,
          gender: User.gender,
          address: User.address,
        }),
      });

      if (profileRes.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!profileRes.ok) {
        throw new Error("Failed to update profile");
      }

      if (selectedPhotoFile) {
        const form = new FormData();
        form.append("photo", selectedPhotoFile);

        const photoRes = await fetch(`${API}/api/profile/photo`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });

        if (photoRes.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!photoRes.ok) {
          throw new Error("Failed to upload photo");
        }

        const photoData = await photoRes.json();
        setProfile({ ...User, photo: photoData.photo });
      }

      setEditing(false);
      setSelectedPhotoFile(null);
      toast.success("Profile saved successfully!", { position: "top-right" });
    } catch (err) {
      toast.error("Error saving profile: " + err.message, { position: "top-right" });
      toast.error("Failed to save profile", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSelectedPhotoFile(null);
    toast.info("Profile changes discarded", { position: "top-right" });
    setSelectedPhotoFile(null);
    window.location.reload();
  };

  // --------------------------
  // CHANGE PASSWORD SUBMIT
  // --------------------------
  const handlePasswordChange = async () => {
    const token = localStorage.getItem("token");

    const currentPassword = document.getElementById("currentPass").value;
    const newPassword = document.getElementById("newPass").value;
    const confirmPassword = document.getElementById("confirmPass").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required", { position: "top-right" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match", { position: "top-right" });
      return;
    }

    try {
      const res = await fetch(`${API}/api/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Password update failed", { position: "top-right" });
        return;
      }

      toast.success("Password updated successfully!", { position: "top-right" });
      setShowPasswordModal(false);
    } catch (err) {
      toast.error("Error updating password", { position: "top-right" });
    }
  };

  // --------------------------
  // LOADING SPINNER
  // --------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <ProfileToastNotification profile={User} />

      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <img
            src={
              selectedPhotoFile
                ? User.photo
                : User.photo
                ? `${API}${User.photo}`
                : "/default.png"
            }
            className="w-40 h-40 rounded-full border object-cover"
            alt="Profile"
            onError={(e) => {
              e.target.src = "/default.png";
            }}
          />

          {editing && (
            <>
              <button
                className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                onClick={() => fileRef.current.click()}
              >
                Upload Photo
              </button>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                onChange={handlePhoto}
                accept="image/*"
              />
            </>
          )}
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="fullName"
            disabled={!editing}
            value={User.fullName}
            onChange={handleChange}
            className={`border p-3 rounded-lg ${!editing ? "bg-gray-100" : ""}`}
            placeholder="Full Name"
          />

          <input
            name="email"
            disabled
            value={User.email}
            className="border p-3 rounded-lg bg-gray-100"
            placeholder="Email"
          />

          <input
            name="phone"
            disabled={!editing}
            value={User.phone}
            onChange={handleChange}
            className={`border p-3 rounded-lg ${!editing ? "bg-gray-100" : ""}`}
            placeholder="Phone"
          />
          

          <select
            name="gender"
            disabled={!editing}
            value={User.gender}
            onChange={handleChange}
            className={`border p-3 rounded-lg ${!editing ? "bg-gray-100" : ""}`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="address"
            disabled={!editing}
            value={User.address}
            onChange={handleChange}
            className={`border p-3 rounded-lg md:col-span-2 ${
              !editing ? "bg-gray-100" : ""
            }`}
            placeholder="Address"
          />

        </div>
        {/* MAP DIRECTION BUTTON */}
<div className="md:col-span-2 mt-2">
  <a
    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      User.address || ""
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full block text-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
  >
    Get Directions
  </a>
</div>


        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">

          {/* CHANGE PASSWORD BUTTON */}
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>

          {!editing ? (
            <button
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
     {showPasswordModal && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

    <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-fadeIn">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <input
        id="currentPass"
        type="password"
        className="border p-3 rounded w-full mb-3"
        placeholder="Current Password"
      />

      <input
        id="newPass"
        type="password"
        className="border p-3 rounded w-full mb-3"
        placeholder="New Password"
      />

      <input
        id="confirmPass"
        type="password"
        className="border p-3 rounded w-full mb-4"
        placeholder="Confirm New Password"
      />

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
          onClick={() => setShowPasswordModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          onClick={handlePasswordChange}
        >
          Update
        </button>
      </div>
    </div>

  </div>
)}


    </div>
  );
}

export default ProfilePage;

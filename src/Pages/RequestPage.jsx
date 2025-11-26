import "../App.css";
import Navbar from "../Components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInbox,
  faPaperPlane,
  faCheck,
  faTimes,
  faClock,
  faUser,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faVenusMars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function Requests() {
  const API = "http://localhost:5000";
  
  // Safely parse user to prevent crash if local storage is empty
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [acceptLoadingId, setAcceptLoadingId] = useState(null);
  const [rejectLoadingId, setRejectLoadingId] = useState(null);
  
  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Helper to get headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const loadRequests = useCallback(async () => {
    if (!user) return; 

    try {
      const res = await axios.get(`${API}/api/requests/${user.id}`, getAuthHeaders());
      setReceivedRequests(res.data.receivedRequests || []);
      setSentRequests(res.data.madeRequests || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error("Failed to load requests");
      }
    }
  }, [user, API]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const statusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    const colors = {
      Pending: "bg-yellow-100 text-yellow-700",
      Accepted: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
      Returned: "bg-blue-100 text-blue-700",
    };

    return (
      <span className={`${base} ${colors[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  const handleAccept = async (id) => {
    setAcceptLoadingId(id);
    try {
      await axios.put(`${API}/api/requests/${id}/accept`, {}, getAuthHeaders());
      toast.success("Request accepted");
      await loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept");
    }
    setAcceptLoadingId(null);
  };

  const handleReject = async (id) => {
    setRejectLoadingId(id);
    try {
      await axios.put(`${API}/api/requests/${id}/reject`, {}, getAuthHeaders());
      toast.success("Request rejected");
      await loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
    setRejectLoadingId(null);
  };

  // View User Profile
  const handleViewProfile = async (userId) => {
    if (!userId) {
      toast.error("User ID not available");
      return;
    }

    setLoadingProfile(true);
    setShowProfileModal(true);
    setSelectedUser(null);
    
    try {
      const res = await axios.get(`${API}/api/profile/${userId}`, getAuthHeaders());
      setSelectedUser(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User profile not found");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized. Please login again");
      } else {
        toast.error(err.response?.data?.message || "Failed to load user profile");
      }
      setShowProfileModal(false);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <h2 className="text-2xl font-bold text-gray-700">Please Log In</h2>
                <p className="text-gray-500">You need to be logged in to view requests.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
        {/* RECEIVED REQUESTS */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faInbox} className="text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Received Requests</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3">Book</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {receivedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400">
                      <FontAwesomeIcon icon={faInbox} className="text-2xl mb-2" />
                      <p>No requests found</p>
                    </td>
                  </tr>
                ) : (
                  receivedRequests.map((req) => (
                    <tr key={req._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">
                        {req.bookId?.title || "Unknown Book"}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">
                            {req.userId?.fullName || "Unknown User"}
                          </span>
                          {req.userId?._id && (
                            <button
                              onClick={() => handleViewProfile(req.userId._id)}
                              className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 transition"
                              title="View Profile"
                            >
                              <FontAwesomeIcon icon={faUser} className="mr-1" />
                              View
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-gray-500">
                        {formatDate(req.createdAt)}
                      </td>

                      <td className="p-3">{statusBadge(req.status)}</td>

                      <td className="p-3 text-center">
                        {req.status === "Pending" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAccept(req._id)}
                              disabled={acceptLoadingId === req._id}
                              className={`px-3 py-1 text-xs text-white rounded-md transition ${
                                acceptLoadingId === req._id
                                  ? "bg-green-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {acceptLoadingId === req._id ? "Loading..." : (
                                <>
                                  <FontAwesomeIcon icon={faCheck} /> Accept
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleReject(req._id)}
                              disabled={rejectLoadingId === req._id}
                              className={`px-3 py-1 text-xs text-white rounded-md transition ${
                                rejectLoadingId === req._id
                                  ? "bg-red-400 cursor-not-allowed"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                            >
                              {rejectLoadingId === req._id ? "Loading..." : (
                                <>
                                  <FontAwesomeIcon icon={faTimes} /> Reject
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SENT REQUESTS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faPaperPlane} className="text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Sent Requests</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3">Book</th>
                  <th className="p-3">To User</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {sentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400">
                      <FontAwesomeIcon icon={faPaperPlane} className="text-2xl mb-2" />
                      <p>No requests found</p>
                    </td>
                  </tr>
                ) : (
                  sentRequests.map((req) => (
                    <tr key={req._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{req.bookId?.title}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">
                            {req.bookId?.userId?.fullName || "Unknown User"}
                          </span>
                          {req.bookId?.userId?._id && (
                            <button
                              onClick={() => handleViewProfile(req.bookId.userId._id)}
                              className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 transition"
                              title="View Profile"
                            >
                              <FontAwesomeIcon icon={faUser} className="mr-1" />
                              View
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">{formatDate(req.createdAt)}</td>
                      <td className="p-3">{statusBadge(req.status)}</td>
                      <td className="p-3 text-center">
                        {req.status === "Pending" && (
                          <span className="flex items-center justify-center gap-1 text-yellow-600">
                            <FontAwesomeIcon icon={faClock} /> Pending
                          </span>
                        )}
                        {req.status === "Accepted" && (
                          <span className="flex items-center justify-center gap-1 text-green-600">
                            <FontAwesomeIcon icon={faCheck} /> Accepted
                          </span>
                        )}
                        {req.status === "Rejected" && (
                          <span className="flex items-center justify-center gap-1 text-red-600">
                            <FontAwesomeIcon icon={faTimes} /> Rejected
                          </span>
                        )}
                        {req.status === "Returned" && (
                          <span className="flex items-center justify-center gap-1 text-blue-600">
                            <FontAwesomeIcon icon={faCheck} /> Returned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* USER PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-800 text-white p-4 flex justify-between items-center rounded-t-xl z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} />
                User Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loadingProfile ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mb-4"></div>
                  <p className="text-gray-500">Loading profile...</p>
                </div>
              ) : selectedUser ? (
                <div>
                  {/* Profile Photo */}
                  <div className="flex justify-center mb-6">
                    <img
                      src={
                         selectedUser.photo
                          ? (selectedUser.photo.startsWith("http") ? selectedUser.photo : `${API}${selectedUser.photo}`)
                          : "/default.png"
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover"
                      onError={(e) => {
                        e.target.src = "/default.png";
                      }}
                    />
                  </div>

                  {/* User Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faUser} className="text-gray-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Full Name</p>
                        <p className="text-gray-800 font-medium">
                          {selectedUser.fullName || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                        <p className="text-gray-800 font-medium break-all">
                          {selectedUser.email || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                        <p className="text-gray-800 font-medium">
                          {selectedUser.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faVenusMars} className="text-gray-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Gender</p>
                        <p className="text-gray-800 font-medium">
                          {selectedUser.gender || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Address</p>
                        <p className="text-gray-800 font-medium">
                          {selectedUser.address || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* CORRECTED GOOGLE MAPS LINK */}
                    {selectedUser.address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          selectedUser.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition mt-4"
                      >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                        Get Directions
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-red-500 text-lg mb-2">Failed to load profile</p>
                  <p className="text-gray-500 text-sm">Please check console for details</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Requests;
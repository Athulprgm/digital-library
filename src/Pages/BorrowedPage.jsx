import "../App.css";
import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookReader } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Borrowed() {
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // Defensive parse: localStorage might not have "user"
  let parsedUser = null;
  try {
    parsedUser = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    parsedUser = null;
  }
  const userId = parsedUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      toast.error("User not logged in");
      return;
    }
    loadBorrowed();
  }, [userId]);

  const loadBorrowed = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/${userId}`);

      const madeRequests = Array.isArray(res?.data?.madeRequests)
        ? res.data.madeRequests
        : [];

      const accepted = madeRequests.filter((req) => req?.status === "Accepted");

      setBorrowed(accepted);
    } catch (err) {
      console.error("Error loading borrowed books:", err);
      toast.error("Error loading borrowed books");
      setBorrowed([]);
    } finally {
      setLoading(false);
    }
  };

  const openConfirm = (reqId, bookId) => {
    setSelectedReq(reqId);
    setSelectedBook(bookId);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setSelectedReq(null);
    setSelectedBook(null);
  };

  const returnBook = async () => {
    if (!selectedReq) {
      toast.error("Invalid request id");
      return;
    }

    const payload = {};
    if (selectedBook) payload.bookId = selectedBook;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/requests/return/${selectedReq}`,
        payload
      );

      toast.success(res?.data?.message || "Book returned successfully");
      setBorrowed((prev) => prev.filter((b) => b?._id !== selectedReq));
    } catch (err) {
      console.error("Failed to return book:", err);
      toast.error("Failed to return book");
    }

    closeConfirm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* CONFIRMATION MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-80 p-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
              Confirm Return
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to return this book?
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeConfirm}
                className="flex-1 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={returnBook}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="flex-grow flex flex-col items-center p-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faBookReader} className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
            Borrowed Books
          </h1>
          <p className="text-gray-500">Books you have borrowed from others</p>
        </div>

        {loading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {borrowed.map((req) => {
                if (!req) return null;

                const book = req.bookId ?? null;
                const owner = book?.userId ?? null;

                if (!book) {
                  return (
                    <div
                      key={req._id || Math.random()}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition p-5"
                    >
                      <h2 className="text-lg font-semibold text-gray-800">
                        Book data missing
                      </h2>
                      <p className="text-sm text-gray-500 mt-2">
                        The book for this request is no longer available or the data is incomplete.
                      </p>

                      <button
                        onClick={() => openConfirm(req._id, null)}
                        className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Mark as Returned
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                  >
                    <img
                      src={
                        book?.image
                          ? `http://localhost:5000/${book.image}`
                          : "/placeholder.png"
                      }
                      alt={book?.title ?? "Untitled"}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-5">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {book?.title ?? "Untitled"}
                      </h2>

                      <p className="text-sm text-gray-600">by {book?.author ?? "Unknown"}</p>
                      <p className="text-sm text-gray-500 italic">{book?.genre ?? ""}</p>
                      <p className="text-sm text-gray-500 mt-2 mb-2">
                        {book?.description ?? ""}
                      </p>

                      <span className="mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 inline-block">
                        Borrowed
                      </span>

                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Owner:</strong> {owner?.fullName ?? "Unknown owner"}
                      </p>
                      <p className="text-sm text-gray-500">{owner?.email ?? ""}</p>

                      {req.message && (
                        <p className="text-xs text-gray-500 mt-3 italic">"{req.message}"</p>
                      )}

                      <button
                        onClick={() => openConfirm(req._id, book?._id)}
                        className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {borrowed.length === 0 && (
              <div className="text-center py-12">
                <FontAwesomeIcon
                  icon={faBookReader}
                  className="text-gray-300 text-4xl mb-4"
                />
                <p className="text-gray-500">You have not borrowed any books yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Borrowed;

import "../App.css";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import SearchFilter from "../Components/SearchFilter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [books, setBooks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [requesting, setRequesting] = useState({});

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data.data || []);
    } catch {
      toast.error("Error fetching books");
    }
  };

  const updateBookStatus = (bookId, newStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === bookId ? { ...b, status: newStatus } : b))
    );
  };

  const handleRequest = async (book) => {
    if (!userId) return toast.error("User not found");

    const id = book._id;
    const prevStatus = book.status;

    setRequesting((prev) => ({ ...prev, [id]: true }));

    setBooks((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "Pending" } : b))
    );

    try {
      await axios.post("http://localhost:5000/api/requests", {
        bookId: id,
        userId,
      });

      toast.success("Request sent");
    } catch (error) {
      setBooks((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: prevStatus } : b))
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to send request"
      );
    } finally {
      setRequesting((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    }
  };

  const visibleBooks = showAll ? books : books.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 md:px-12 py-10 max-w-7xl mx-auto">
        {isAuthenticated && (
          <section className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
              Welcome Back
            </h1>
            <h4 className="inline-block font-bold text-3xl text-red-700 ">{user?.fullName?.toUpperCase()}</h4>  
          </section>
        )}

        <SearchFilter onBookStatusChange={updateBookStatus} />

        <section className="mt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              All Books
            </h2>

            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="text-gray-700 font-medium hover:text-black flex items-center gap-1 transition"
              >
                View More <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className="text-gray-700 font-medium hover:text-black flex items-center gap-1 transition"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> View Less
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {visibleBooks.map((b) => {
              const requestingNow = requesting[b._id] === true;
              const isOwner = b.userId === userId;

              return (
                <div
                  key={b._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
                >
                  <img
                    src={`http://localhost:5000/${b.image}`}
                    alt={b.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {b.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">{b.author}</p>
                    <p className="text-gray-500 text-sm mb-3 font-bold">{b.genre}</p>
                    <p className="text-gray-500 text-sm mb-3 italic">{b.description}</p>
                    

                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${
                        b.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>

                    {isAuthenticated &&
                      !isOwner &&
                      b.status === "Available" && (
                        <button
                          onClick={() => handleRequest(b)}
                          disabled={requestingNow}
                          className="bg-gray-800 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-black transition flex items-center mx-auto gap-2 disabled:opacity-50"
                        >
                          <FontAwesomeIcon icon={faBookmark} />
                          {requestingNow ? "Requesting..." : "Request Book"}
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;

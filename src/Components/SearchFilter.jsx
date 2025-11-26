import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

function SearchFilter({ onBookStatusChange }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [books, setBooks] = useState([]);
  const [genreOptions, setGenreOptions] = useState(["All"]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [requestingIds, setRequestingIds] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");

  const searchBoxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        
        setHasSearched(false);
        setBooks([]);
        setQuery("");
        setGenre("All");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRequest = async (book) => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    const bookId = book._id;
    const originalStatus = book.status;

    setRequestingIds((prev) => [...prev, bookId]);

    setBooks((prev) =>
      prev.map((b) => (b._id === bookId ? { ...b, status: "Pending" } : b))
    );

    if (onBookStatusChange) {
      onBookStatusChange(bookId, "Pending");
    }

    try {
      await axios.post("http://localhost:5000/api/requests", {
        bookId,
        userId: user.id,
      });

      toast.success("Request sent successfully");
    } catch (error) {
      setBooks((prev) =>
        prev.map((b) =>
          b._id === bookId ? { ...b, status: originalStatus } : b
        )
      );

      if (onBookStatusChange) {
        onBookStatusChange(bookId, originalStatus);
      }

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to send request"
      );
    } finally {
      setRequestingIds((prev) => prev.filter((id) => id !== bookId));
    }
  };

  
  const fetchBooks = async () => {
    if (!hasSearched) return;

    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/books", {
        params: {
          search: query,
          genre: genre === "All" ? "" : genre,
        },
      });

      const data = res.data.data || [];
      setBooks(data);

      const genres = new Set(data.map((b) => b.genre));
      setGenreOptions(["All", ...genres]);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        const data = res.data.data || [];

        const genres = new Set(data.map((b) => b.genre));
        setGenreOptions(["All", ...genres]);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [query, genre, hasSearched]);

  return (
    <div
      ref={searchBoxRef}
      className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute inset-y-0 left-3 my-auto text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHasSearched(true);
            }}
            onKeyDown={(e) => e.key === "Enter" && setHasSearched(true)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
          />
        </div>

       
        <div className="relative w-full sm:w-48">
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute inset-y-0 left-3 my-auto text-gray-400"
          />
          <select
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setHasSearched(true);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white"
          >
            {genreOptions.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

     
        <div className="flex gap-2">
          <button
            onClick={() => setHasSearched(true)}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg"
          >
            Search
          </button>

          {hasSearched && (
            <button
              onClick={() => {
                setQuery("");
                setGenre("All");
                setBooks([]);
                setHasSearched(false);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              Close
            </button>
          )}
        </div>
      </div>

      
      {loading && (
        <p className="text-center text-gray-600 font-medium">Loading...</p>
      )}

      
      <div className="grid grid-cols-1 gap-4">
        {hasSearched &&
          !loading &&
          books.map((book) => (
            <div
              key={book._id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex gap-3"
            >
              <img
                src={`http://localhost:5000/${book.image}`}
                className="w-20 h-20 object-cover rounded-md"
              />

              <div className="flex flex-col">
                <h2 className="text-sm font-semibold">{book.title}</h2>
                <p className="text-xs text-gray-600">{book.author}</p>

                <span className="mt-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] rounded-full">
                  {book.genre}
                </span>

                <span
                  className={`mt-1 text-xs font-semibold ${
                    book.status === "Available"
                      ? "text-green-700"
                      : book.status === "Pending"
                      ? "text-yellow-700"
                      : "text-gray-600"
                  }`}
                >
                  {book.status}
                </span>

                {isAuthenticated &&
                  book.userId !== user?.id &&
                  book.status === "Available" && (
                    <button
                      onClick={() => handleRequest(book)}
                      disabled={requestingIds.includes(book._id)}
                      className="mt-2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md hover:bg-black disabled:opacity-50"
                    >
                      {requestingIds.includes(book._id)
                        ? "Requesting..."
                        : "Request Book"}
                    </button>
                  )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchFilter;

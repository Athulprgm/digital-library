import "../App.css";
import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

function MyBooks() {
  const [books, setBooks] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editBook, setEditBook] = useState({
    title: "",
    author: "",
    genre: "",
    image: "",
    status: "",
  });
  const [newImage, setNewImage] = useState(null); // For handling new image uploads

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data.data);
    } catch (err) {
      toast.error("Error fetching books");
    }
  };

  // -------------------- DELETE LOGIC --------------------
  const openDeletePopup = (id) => {
    setDeleteId(id);
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/books/${deleteId}`
      );

      toast.success(res.data.message);
      setShowPopup(false);
      getBooks();
    } catch (err) {
      toast.error("Delete error");
    }
  };

  // -------------------- EDIT LOGIC --------------------
  const openEditPopup = (book) => {
    setEditId(book._id);
    setEditBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      image: book.image,
      status: book.status || "Available",
    });
    setNewImage(null); // Reset new image when opening edit popup
  };

  const updateBook = async () => {
    try {
      // If a new image is uploaded, use FormData
      if (newImage) {
        const formData = new FormData();
        formData.append("title", editBook.title);
        formData.append("author", editBook.author);
        formData.append("genre", editBook.genre);
        formData.append("status", editBook.status);
        formData.append("image", newImage);

        const res = await axios.put(
          `http://localhost:5000/api/books/${editId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(res.data.message || "Book updated");
      } else {
        // If no new image, send as JSON
        const res = await axios.put(
          `http://localhost:5000/api/books/${editId}`,
          editBook
        );

        toast.success(res.data.message || "Book updated");
      }

      setEditId(null);
      setNewImage(null); // Reset new image
      getBooks();
    } catch (err) {
      toast.error("Update error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow flex flex-col items-center p-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faBook} className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
            My Uploaded Books
          </h1>
          <p className="text-gray-500">
            Manage your personal collection of books
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <img
                src={`http://localhost:5000/${book.image}`}
                alt={book.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="text-sm text-gray-500 italic">{book.genre}</p>

                <span
                  className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    book.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : book.status === "Borrowed"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {book.status || "Available"}
                </span>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => openEditPopup(book)}
                    className="flex-1 bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-black transition duration-200 shadow-sm flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>

                  <button
                    onClick={() => openDeletePopup(book._id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faBook} className="text-gray-300 text-4xl mb-4" />
            <p className="text-gray-500">
              You haven't uploaded any books yet.
            </p>
          </div>
        )}
      </div>

      {/* -------------------- DELETE POPUP -------------------- */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTrash} className="text-red-600 text-xl" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCheck} />
                Yes, Delete
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- EDIT POPUP -------------------- */}
      {editId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit Book</h2>
              <button
                onClick={() => setEditId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Title"
                  value={editBook.title}
                  onChange={(e) =>
                    setEditBook({ ...editBook, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Author
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Author"
                  value={editBook.author}
                  onChange={(e) =>
                    setEditBook({ ...editBook, author: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Genre
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Genre"
                  value={editBook.genre}
                  onChange={(e) =>
                    setEditBook({ ...editBook, genre: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Current Image
                </label>
                {editBook.image && (
                  <img
                    src={`http://localhost:5000/${editBook.image}`}
                    alt="Current book"
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                
                <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUpload} />
                  Upload New Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                {newImage && (
                  <p className="text-gray-500 text-sm mt-1">
                    New image selected: {newImage.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={editBook.status}
                  onChange={(e) =>
                    setEditBook({ ...editBook, status: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Pending">Pending</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditId(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>

              <button
                onClick={updateBook}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCheck} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooks;
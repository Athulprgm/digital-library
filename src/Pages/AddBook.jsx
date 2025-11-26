import "../App.css";
import Navbar from "../Components/Navbar";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function AddBook() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [customGenre, setCustomGenre] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalGenre = genre === "Other" ? customGenre : genre;

    if (!title || !author || !finalGenre) {
      toast.error("Fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user?.id);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", finalGenre);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/books/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      setTitle("");
      setAuthor("");
      setGenre("");
      setCustomGenre("");
      setDescription("");
      setImage(null);
    } catch (err) {
      toast.error("Failed to add book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-[90%] max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Add New Book
            </h1>
            <p className="text-gray-500 mt-2">
              Fill in the details to add a new book to your library
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Genre</label>

                {genre === "Other" ? (
                  <input
                    type="text"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    placeholder="Enter custom genre"
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                ) : (
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <option value="">Select Genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Novel</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Upload Image
                </label>
                <div className="border border-gray-300 rounded-lg p-2 bg-gray-50 focus-within:ring-2 focus-within:ring-gray-400 flex items-center">
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="text-gray-500 mr-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="bg-transparent focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-2 bg-gray-800 text-white font-semibold py-3 rounded-lg w-full hover:bg-black transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBook;

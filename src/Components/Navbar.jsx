import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlus,
  faBook,
  faInbox,
  faSignOutAlt,
  faSignInAlt,
  faBars,
  faTimes,
  faBookReader,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const API = "https://digitallibrary-backend.onrender.com";
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");

  // 🔥 Load user profile photo in navbar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function loadPhoto() {
      try {
        const res = await fetch(`${API}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProfilePhoto(data.photo ? `${API}${data.photo}` : "/default.png");
        }
      } catch (error) {
        setProfilePhoto("/default.png");
      }
    }

    loadPhoto();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-black bg-gray-200 px-3 py-1 rounded-lg font-semibold"
      : "text-gray-700 hover:text-black hover:bg-gray-100 px-3 py-1 rounded-lg transition-all";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-800">LibGo</h1>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={`flex items-center gap-2 ${isActive("/")}`}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/add-book"
                className={`flex items-center gap-2 ${isActive("/add-book")}`}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Book
              </Link>

              <Link
                to="/borrowed"
                className={`flex items-center gap-2 ${isActive("/borrowed")}`}
              >
                <FontAwesomeIcon icon={faBookReader} /> Borrowed
              </Link>

              <Link
                to="/my-books"
                className={`flex items-center gap-2 ${isActive("/my-books")}`}
              >
                <FontAwesomeIcon icon={faBook} /> My Books
              </Link>

              <Link
                to="/requests"
                className={`flex items-center gap-2 ${isActive("/requests")}`}
              >
                <FontAwesomeIcon icon={faInbox} /> Requests
              </Link>

              {/* 🔥 PROFILE IMAGE IN NAVBAR */}
              <Link
                to="/ProfilePage"
                className={`flex items-center gap-2 ${isActive("/ProfilePage")}`}
              >
                <img
                  src={profilePhoto || "/default.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border object-cover "
                />
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white px-4 py-1.5 rounded-lg hover:bg-black flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          ) : (
            <Link
              to="/Login"
              className={`bg-gray-800 text-white px-4 py-1.5 rounded-lg hover:bg-black flex items-center gap-2 ${isActive(
                "/Login"
              )}`}
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col items-center gap-4 bg-gray-50 py-4 border-t border-gray-200">
          <Link to="/" className={`flex items-center gap-2 ${isActive("/")}`}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/add-book"
                className={`flex items-center gap-2 ${isActive("/add-book")}`}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Book
              </Link>

              <Link
                to="/borrowed"
                className={`flex items-center gap-2 ${isActive("/borrowed")}`}
              >
                <FontAwesomeIcon icon={faBookReader} /> Borrowed
              </Link>

              <Link
                to="/my-books"
                className={`flex items-center gap-2 ${isActive("/my-books")}`}
              >
                <FontAwesomeIcon icon={faBook} /> My Books
              </Link>

              <Link
                to="/requests"
                className={`flex items-center gap-2 ${isActive("/requests")}`}
              >
                <FontAwesomeIcon icon={faInbox} /> Requests
              </Link>

              {/* 🔥 PROFILE IMAGE MOBILE */}
              <Link
                to="/ProfilePage"
                className={`flex items-center gap-2 ${isActive("/ProfilePage")}`}
              >
                <img
                  src={profilePhoto || "/default.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border object-cover"
                />
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white px-4 py-1.5 rounded-lg hover:bg-black flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          ) : (
            <Link
              to="/Login"
              className={`bg-gray-800 text-white px-4 py-1.5 rounded-lg hover:bg-black flex items-center gap-2 ${isActive(
                "/Login"
              )}`}
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

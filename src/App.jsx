import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import AddBook from "./Pages/AddBook";
import MyBooks from "./Pages/MyBooks";
import Home from "./Pages/Home";
import RequestPage from "./Pages/RequestPage";
import Navbar from "./Components/Navbar";
import Borrowed from "./Pages/BorrowedPage";
import ProfilePage from "./Pages/ProfilePage";
import ProfileToastNotification from "./Components/ProfileToastNotification";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";



function App() {
  
  // Load saved profile from localStorage (for notification)
  const savedProfile = JSON.parse(localStorage.getItem("profileData")) || {};

  return (
    <Router>
        
        <ProfileToastNotification profile={savedProfile} />
  

        {/* PAGE ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/ProfilePage" element={<ProfilePage />} />

        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/requests" element={<RequestPage />} />

        <Route path="/borrowed" element={<Borrowed />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      </Routes>
    </Router>
  );
}

export default App;
export const API = "http://localhost:5000";


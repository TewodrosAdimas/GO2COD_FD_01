import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Register from "./components/Accounts/Register/Register";
import Login from "./components/Accounts/Login/Login";
import EditProfile from "./components/Accounts/Profile/EditProfile";
import Profile from "./components/Accounts/Profile/Profile";
import AllProfiles from "./components/Accounts/Profile/AllUsers";
import Posts from "./components/Posts/ListPost/Posts";
import CreatePost from "./components/Posts/CreatePost/CreatePost";
import PostDetails from "./components/Posts/PostDetails";
import Notifications from "./components/Notifications/Notifications";
import "./apps.css"; // Adjust the path as necessary

// Navbar component
const Navbar = () => {
  const isLoggedIn = localStorage.getItem("auth_token"); // Check if token exists in localStorage
  const navigate = useNavigate(); // Hook for navigation

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token"); // Remove the auth token from localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/login" className="logo-link">
          TedBlog
        </Link>
      </div>
      <ul className="nav-links">
        {isLoggedIn ? ( // Only show Profile link when logged in
          <>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/all_profiles">All Users</Link>
            </li>
            <li>
              <Link to="/posts/create">Create Post</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li>
              <Link to="/feeds">Feeds</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>{" "}
              {/* Logout button */}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar added here */}
      <Routes>
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all_profiles" element={<AllProfiles />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/feeds" element={<Posts />} /> {/* Add Feeds route */}
      </Routes>
    </Router>
  );
};

export default App;

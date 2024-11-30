import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Accounts/Register/Register";
import Login from "./components/Accounts/Login/Login";
import EditProfile from "./components/Accounts/Profile/EditProfile";
import Profile from "./components/Accounts/Profile/Profile"; // Import Profile component
import AllProfiles from "./components/Accounts/Profile/AllUsers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all_profiles" element={<AllProfiles />} />{" "}
        {/* Route for all user profiles */}
      </Routes>
    </Router>
  );
};

export default App;

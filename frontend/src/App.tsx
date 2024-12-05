import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Accounts/Register/Register";
import Login from "./components/Accounts/Login/Login";
import EditProfile from "./components/Accounts/Profile/EditProfile";
import Profile from "./components/Accounts/Profile/Profile";
import AllProfiles from "./components/Accounts/Profile/AllUsers";
import Posts from "./components/Posts/ListPost/Posts";
import CreatePost from "./components/Posts/CreatePost/CreatePost";
import UpdatePost from "./components/Posts/UpdatePost";
import PostDetails from "./components/Posts/PostDetails";
import Notifications from "./components/Notifications/Notifications";
import Feeds from "./components/Posts/Feeds/Feeds";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all_profiles" element={<AllProfiles />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/:id/edit" element={<UpdatePost />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/feeds" element={<Posts />} /> {/* Add Feeds route */}
      </Routes>
    </Router>
  );
};

export default App;

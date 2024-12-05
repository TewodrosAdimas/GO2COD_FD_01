import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Styles.css"; // Import the CSS file for additional styling

// Define the type for profile data
interface ProfileData {
  username: string;
  email: string;
  bio: string | null;
  profile_picture: string | null;
  follower_count: number; // Add follower_count to the ProfileData interface
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      axios
        .get<ProfileData>("http://localhost:8000/accounts/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setProfileData(response.data); // No need for explicit AxiosResponse
          setLoading(false);
        })
        .catch((err) => {
          setError("An error occurred while fetching your profile.");
          console.error("Error fetching profile:", err);
          setLoading(false);
        });
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  }, []);

  // Handle profile picture URL
  const profilePictureUrl = profileData?.profile_picture
    ? `http://localhost:8000${profileData.profile_picture}`
    : "https://via.placeholder.com/150";

  return (
    <div className="container profile-container">

      {loading && (
        <p className="text-center text-secondary">Loading your profile...</p>
      )}

      {error && <p className="text-danger text-center">{error}</p>}

      {profileData && (
        <div className="card shadow-lg profile-card">
          <div className="row g-0">
            <div className="col-md-4 d-flex justify-content-center align-items-center">
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="img-fluid rounded-circle profile-picture"
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h4 className="card-title">Welcome, {profileData.username}</h4>
                <p className="card-text">
                  <strong>Email:</strong> {profileData.email}
                </p>
                <p className="card-text">
                  <strong>Bio:</strong> {profileData.bio || "No bio available"}
                </p>
                <p className="card-text">
                  <strong>Followers:</strong> {profileData.follower_count}
                </p>
                <Link to="/profile/edit" className="btn btn-primary mt-3">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

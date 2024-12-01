import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllProfiles.css"; // Custom CSS for styling

interface User {
  username: string;
  email: string;
  bio: string | null;
  profile_picture: string | null;
  is_following: boolean; // Ensure the backend provides this field
}

const AllProfiles = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profiles and their follow status
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .get<User[]>("http://localhost:8000/accounts/all_profiles/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("An error occurred while fetching profiles.");
          console.error("Error fetching profiles:", err);
          setLoading(false);
        });
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  }, []);

  // Handle profile picture URL
  const profilePictureUrl = (profile_picture: string | null) => {
    return profile_picture
      ? `http://localhost:8000${profile_picture}`
      : "https://via.placeholder.com/150";
  };

  // Toggle follow/unfollow status
  const toggleFollow = (username: string, isCurrentlyFollowing: boolean) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const url = isCurrentlyFollowing
        ? `http://localhost:8000/accounts/unfollow/${username}/`
        : `http://localhost:8000/accounts/follow/${username}/`;

      axios
        .post(
          url,
          {},
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        )
        .then(() => {
          // Update local state to reflect the change
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.username === username
                ? { ...user, is_following: !isCurrentlyFollowing }
                : user
            )
          );
        })
        .catch((err) => {
          console.error("Error toggling follow status:", err);
        });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">All User Profiles</h2>

      {loading && (
        <p className="text-center text-secondary">Loading profiles...</p>
      )}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {users.map((user) => (
          <div className="col" key={user.username}>
            <div className="card shadow-sm profile-card">
              <div className="card-body text-center">
                <img
                  src={profilePictureUrl(user.profile_picture)}
                  alt="Profile"
                  className="img-fluid rounded-circle profile-picture"
                  style={{ width: "120px", height: "120px" }}
                />
                <h5 className="card-title mt-3">{user.username}</h5>
                <p className="card-text">{user.bio || "No bio available"}</p>
                <p className="card-text">
                  <strong>Email:</strong> {user.email}
                </p>

                {/* Follow/Unfollow button */}
                <button
                  className={`btn ${
                    user.is_following ? "btn-danger" : "btn-primary"
                  } w-100`}
                  onClick={() => toggleFollow(user.username, user.is_following)}
                >
                  {user.is_following ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProfiles;

import React, { useState, useEffect } from "react";
import axios from "axios";

interface FollowButtonProps {
  targetUsername: string; // The username of the user to follow/unfollow
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUsername }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // To handle errors

  // Fetch follow status on component mount or when targetUsername changes
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .get(`http://localhost:8000/accounts/profile/${targetUsername}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data); // Log the response for debugging
          setIsFollowing(response.data.is_following); // Set follow status based on response
        })
        .catch((err) => {
          console.error("Error fetching follow status:", err);
          setError("Failed to fetch follow status");
        });
    } else {
      setError("No authentication token found.");
    }
  }, [targetUsername]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");

    if (token) {
      const url = isFollowing
        ? `http://localhost:8000/accounts/unfollow/${targetUsername}/`
        : `http://localhost:8000/accounts/follow/${targetUsername}/`;

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
        .then((response) => {
          console.log(response.data); // Log the response for debugging
          setIsFollowing((prev) => !prev); // Toggle the state after the request is successful
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error toggling follow status:", err);
          setError("Failed to toggle follow status.");
          setLoading(false);
        });
    } else {
      setError("No authentication token found.");
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}{" "}
      {/* Show error if any */}
      <button
        className={`btn ${isFollowing ? "btn-danger" : "btn-primary"}`}
        onClick={handleFollowToggle}
        disabled={loading}
      >
        {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default FollowButton;

import React, { useState, useEffect } from "react";
import axios from "axios";

interface FollowButtonProps {
  targetUsername: string; // The username of the user to follow/unfollow
}

interface FollowStatusResponse {
  is_following: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUsername }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // To handle errors

  // Function to fetch the current follow status
  const fetchFollowStatus = async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      // Specify the response type to be FollowStatusResponse
      const response = await axios.get<FollowStatusResponse>(
        `http://localhost:8000/accounts/profile/${targetUsername}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Now TypeScript knows that response.data has is_following
      setIsFollowing(response.data.is_following); // Set follow status from response
    } catch (err) {
      console.error("Error fetching follow status:", err);
      setError("Failed to fetch follow status.");
    }
  };

  // Fetch follow status when the component mounts or targetUsername changes
  useEffect(() => {
    fetchFollowStatus();
  }, [targetUsername]);

  // Function to handle follow/unfollow action
  const handleFollowToggle = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }
    const url = isFollowing
      ? `http://localhost:8000/accounts/unfollow/${targetUsername}/`
      : `http://localhost:8000/accounts/follow/${targetUsername}/`;

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(response.data); // Log the response for debugging
      setIsFollowing((prev) => !prev); // Toggle the follow state
    } catch (err) {
      console.error("Error toggling follow status:", err);
      setError("Failed to toggle follow status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Follow/Unfollow Button */}
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

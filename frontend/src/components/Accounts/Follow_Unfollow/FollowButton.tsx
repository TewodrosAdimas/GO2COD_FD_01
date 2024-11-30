import React, { useState, useEffect } from "react";
import axios from "axios";

interface FollowButtonProps {
  targetUsername: string; // The username of the user to follow/unfollow
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUsername }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
          setIsFollowing(response.data.is_following); // Set follow status based on response
        })
        .catch((err) => {
          console.error("Error fetching follow status:", err);
        });
    }
  }, [targetUsername]);

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
          setIsFollowing(!isFollowing); // Toggle follow state
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error toggling follow status:", err);
          setLoading(false);
        });
    }
  };

  return (
    <button
      className={`btn ${isFollowing ? "btn-danger" : "btn-primary"}`}
      onClick={handleFollowToggle}
      disabled={loading}
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;

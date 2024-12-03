import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

interface DeletePostProps {
  postId: number;
}

const DeletePost: FC<DeletePostProps> = ({ postId }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("auth_token");

      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `http://localhost:8000/posts/${postId}/delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Include the token in the request headers
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Redirect to the posts list after successful deletion
      navigate("/posts");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="delete-post-container">
      <h1>Delete Post</h1>
      <p>Are you sure you want to delete this post?</p>
      <div className="form-actions">
        <button type="button" onClick={handleDelete} className="btn delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeletePost;

import React, { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string;
}

interface UpdatePostProps {
  post: Post;
}

const UpdatePost: FC<UpdatePostProps> = ({ post }) => {
  const [updatedPost, setUpdatedPost] = useState<Post>(post);
  const navigate = useNavigate(); // Hook to navigate to other pages

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedPost({ ...updatedPost, [name]: value });
  };

  const handleCancel = () => {
    console.log("Update canceled");
  };

  const handleSave = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("auth_token");

      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `http://localhost:8000/posts/${updatedPost.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Include the token in the request headers
          },
          body: JSON.stringify(updatedPost),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post updated successfully:", result);
      setUpdatedPost(result); // Update the state with the saved post
      // Redirect to the updated post page after save
      navigate(`/posts/${updatedPost.id}`); // Redirect to the post page
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <div className="update-post-container">
      <h1>Update Post</h1>
      <form className="update-post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={updatedPost.title}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={updatedPost.content}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={updatedPost.tags}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn cancel-btn"
          >
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;

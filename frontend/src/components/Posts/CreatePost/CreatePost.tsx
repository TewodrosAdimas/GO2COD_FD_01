import React, { useState } from "react";
import axios, { post } from "axios";


const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Handle tag input change (split tags by comma)
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token"); // Assuming the token is stored in localStorage

    if (token) {
      try {
        // Prepare tags as an array
        const tagArray = tags.split(",").map((tag) => tag.trim());

        // Send POST request to create the post
        const response = await axios.post(
          "http://localhost:8000/posts/create/", // API endpoint
          {
            title,
            content,
            tags: tagArray,
          },
          {
            headers: {
              Authorization: `Token ${token}`, // Sending token for authorization
            },
          }
        );

        // Handle success response
        if (response.status === 201) {
          setMessage("Post created successfully!");
          setTitle("");
          setContent("");
          setTags("");

        }
      } catch (error) {
        setMessage("Error creating post. Please try again.");
      }
    } else {
      setMessage("Please log in to create a post.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>Create New Post</h3>
            </div>
            <div className="card-body">
              {message && (
                <div
                  className={`alert ${
                    message.includes("success")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="content">Content</label>
                  <textarea
                    id="content"
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter post content"
                    rows={5}
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="tags">Tags (comma separated)</label>
                  <input
                    type="text"
                    id="tags"
                    className="form-control"
                    value={tags}
                    onChange={handleTagsChange}
                    placeholder="Enter post tags"
                  />
                </div>

                <button type="submit" className="btn btn-primary mt-4 w-100">
                  Create Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

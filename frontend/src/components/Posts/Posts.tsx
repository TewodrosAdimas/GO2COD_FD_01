import React, { useEffect, useState } from "react";
import axios from "axios";
import FollowButton from "../Accounts/Follow_Unfollow/FollowButton";

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      const baseUrl = "http://localhost:8000/posts/";

      // Construct the URL based on the tagFilter
      let url = baseUrl;
      if (tagFilter) {
        url = `${baseUrl}?tag=${encodeURIComponent(tagFilter)}`;
      }

      const response = await axios.get<Post[]>(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      console.log("Response Data:", response.data); // Debugging log to check the response data

      setPosts(response.data);
    } catch (err) {
      console.error("Error in fetchPosts:", err);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [tagFilter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="posts-container">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by tag (e.g., django)"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="filter-input"
        />
      </div>
      {posts.length === 0 ? (
        <div>No posts available.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h3>{post.author}</h3>
              <FollowButton targetUsername={post.author} />
            </div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="post-meta">
              <small>
                Created at: {new Date(post.created_at).toLocaleString()}
              </small>
              <small>
                Updated at: {new Date(post.updated_at).toLocaleString()}
              </small>
            </div>
            <div className="tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;

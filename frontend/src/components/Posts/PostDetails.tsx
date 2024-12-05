import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css"; // Import the CSS file

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string;
}

interface Comment {
  id: number;
  post: number;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  // Fetch the post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/posts/${id}/`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    // Ensure we only fetch when 'id' exists
    if (id) {
      fetchPost();
    }
  }, [id]); // Dependency is 'id' - fetch only when 'id' changes

  // Fetch comments for the post
useEffect(() => {
  const fetchComments = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/posts/comments/?post=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // Include the token here
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  if (id && post) {
    fetchComments();
  }
}, [id, post]);

  // Get the token from localStorage
  const token = localStorage.getItem("auth_token");

  // Handle comment submission with token authentication
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(
        "http://localhost:8000/posts/comments/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Include the token here (Token authentication)
          },
          body: JSON.stringify({
            post: id,
            content: newComment,
          }),
        }
      );

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment(""); // Reset the form
      } else {
        throw new Error("Failed to post comment.");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  if (!post) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="post-details-container">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p className="tags">Tags: {post.tags}</p>

      <div className="comments-section">
        <h2>Comments</h2>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.author}</strong>
              <p>{comment.content}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  );
};

export default PostDetails;

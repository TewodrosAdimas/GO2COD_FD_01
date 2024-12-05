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

  // Get the token from localStorage
  const token = localStorage.getItem("auth_token");
  const currentUser = localStorage.getItem("username"); // assuming 'current_user' stores the username

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

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/posts/comments/?post=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, token]);

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
            Authorization: `Token ${token}`,
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

  // Handle comment edit
  const handleEditComment = (commentId: number, updatedContent: string) => {
    if (!updatedContent.trim()) {
      console.error("Updated content cannot be empty.");
      return;
    }

    fetch(`http://localhost:8000/posts/comments/${commentId}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        content: updatedContent, // Ensure this is a valid string and not undefined or null
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to edit comment. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((updatedComment) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
          )
        );
      })
      .catch((error) => {
        console.error("Failed to edit comment:", error.message);
      });
  };

  // Handle comment delete
  const handleDeleteComment = (commentId: number) => {
    if (!token || !currentUser) {
      console.error("User is not authenticated.");
      return;
    }

    fetch(`http://localhost:8000/posts/comments/${commentId}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
        } else {
          console.error("Failed to delete comment");
        }
      })
      .catch((error) => {
        console.error("Failed to delete comment:", error);
      });
  };

  // Debugging: Log currentUser and comment.author
  console.log("Current user:", currentUser);

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
          {comments.map((comment) => {
            console.log(
              `Checking comment author: ${comment.author} == ${currentUser}`
            );
            return (
              <li key={comment.id}>
                <strong>{comment.author}</strong>
                <p>{comment.content}</p>
                <small>{new Date(comment.created_at).toLocaleString()}</small>

                {/* Edit and Delete buttons for comments by the logged-in user */}
                {comment.author === currentUser && (
                  <div className="comment-actions">
                    <button
                      onClick={() =>
                        handleEditComment(
                          comment.id,
                          prompt("Edit comment", comment.content) ||
                            comment.content
                        )
                      }
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
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

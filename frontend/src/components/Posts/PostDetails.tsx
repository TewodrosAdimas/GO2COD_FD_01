import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

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
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  const token = localStorage.getItem("auth_token");
  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/posts/${id}/`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    if (id) fetchPost();
  }, [id]);

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
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    if (id) fetchComments();
  }, [id, token]);

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
          body: JSON.stringify({ post: id, content: newComment }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment.");
      const newCommentData = await response.json();
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const openEditModal = (commentId: number, currentContent: string) => {
    setEditCommentId(commentId);
    setEditContent(currentContent);
  };

  const closeEditModal = () => {
    setEditCommentId(null);
    setEditContent("");
  };

  const handleEditComment = async () => {
    if (!editContent.trim() || editCommentId === null) return;

    try {
      const response = await fetch(
        `http://localhost:8000/posts/comments/${editCommentId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ content: editContent }),
        }
      );

      if (!response.ok) throw new Error("Failed to edit comment.");
      const updatedComment = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = (commentId: number) => {
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
      .catch((error) => console.error("Failed to delete comment:", error));
  };

  if (!post) {
    return <div className="loading text-center">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="post-details bg-light p-4 rounded">
        <h1 className="mb-3">{post.title}</h1>
        <p>{post.content}</p>
        <p className="text-muted">Tags: {post.tags}</p>
      </div>

      <div className="comments-section mt-5">
        <h2 className="mb-4">Comments</h2>
        <ul className="list-group mb-4">
          {comments.map((comment) => (
            <li key={comment.id} className="list-group-item">
              <strong>{comment.author}</strong>
              <p>{comment.content}</p>
              <small className="text-muted">
                {new Date(comment.created_at).toLocaleString()}
              </small>
              {comment.author === currentUser && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => openEditModal(comment.id, comment.content)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit} className="form-group">
          <textarea
            className="form-control mb-3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      </div>

      {/* Edit Modal */}
      {editCommentId !== null && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Comment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Update your comment here"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditComment}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UpdatePost from "../UpdatePost";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author: number;
  tags: string[];
}

interface User {
  username: string;
  profile_picture: string | null;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Map<number, User>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [seenPostIds, setSeenPostIds] = useState<Set<number>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query

  const loggedInUsername = localStorage.getItem("username");

  // Function to fetch posts based on search query and pagination
  const fetchPosts = () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setLoading(true);
      let url = `http://localhost:8000/posts/?page=${page}`;
      if (searchQuery) {
        url += `&tag=${searchQuery}`;
      }
      axios
        .get<PaginatedResponse<Post>>(url, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          const postData = response.data.results;
          const newPosts = postData.filter((post) => !seenPostIds.has(post.id));

          if (newPosts.length > 0) {
            setPosts((prevPosts) =>
              page === 1 ? newPosts : [...prevPosts, ...newPosts]
            );
            setSeenPostIds(
              (prevSeen) =>
                new Set([...prevSeen, ...newPosts.map((post) => post.id)])
            );
          }

          setHasNextPage(response.data.next !== null);

          newPosts.forEach((post: Post) => {
            if (!users.has(post.author)) {
              axios
                .get<User>(`http://localhost:8000/accounts/${post.author}/`, {
                  headers: { Authorization: `Token ${token}` },
                })
                .then((userResponse) => {
                  setUsers((prevUsers) =>
                    new Map(prevUsers).set(post.author, userResponse.data)
                  );
                })
                .catch((err) => {
                  console.error("Error fetching user:", err);
                });
            }
          });

          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
          setError("Error fetching posts.");
          setLoading(false);
        });
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, searchQuery, seenPostIds]);

  const profilePictureUrl = (profile_picture: string | null) => {
    return profile_picture
      ? `http://localhost:8000${profile_picture}`
      : "https://via.placeholder.com/500";
  };

  const toggleExpand = (postId: number) => {
    setExpandedPosts((prevExpanded) => {
      const updated = new Set(prevExpanded);
      if (updated.has(postId)) {
        updated.delete(postId);
      } else {
        updated.add(postId);
      }
      return updated;
    });
  };

  const handleSavePost = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setEditingPostId(null);
  };

  const handleDeletePost = async (postId: number) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        await axios.delete(`http://localhost:8000/posts/${postId}/delete`, {
          headers: { Authorization: `Token ${token}` },
        });
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Failed to delete post.");
      }
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Posts</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by tag (e.g., django, python)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && (
        <p className="text-center text-secondary">Loading posts...</p>
      )}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {posts.map((post) => {
          const user = users.get(post.author);
          const isExpanded = expandedPosts.has(post.id);
          const truncatedContent =
            post.content.length > 50 && !isExpanded
              ? post.content.substring(0, 50) + "..."
              : post.content;

          return (
            <div className="col" key={post.id}>
              {editingPostId === post.id ? (
                <UpdatePost
                  post={post}
                  onCancel={() => setEditingPostId(null)}
                  onSave={handleSavePost}
                />
              ) : (
                <div className="card shadow-sm post-card">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-decoration-none"
                      >
                        {post.title}
                      </Link>
                    </h5>
                    <p className="card-text">
                      {truncatedContent}
                      {post.content.length > 50 && (
                        <span
                          className="text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleExpand(post.id)}
                        >
                          {isExpanded ? "See less" : "See more"}
                        </span>
                      )}
                    </p>
                    <div className="d-flex justify-content-between">
                      {user ? (
                        <div>
                          <img
                            src={profilePictureUrl(user.profile_picture)}
                            alt="Profile"
                            className="img-fluid rounded-circle profile-picture"
                            style={{ width: "120px", height: "120px" }}
                          />
                          <strong>{user.username}</strong>
                        </div>
                      ) : (
                        <p>Loading author...</p>
                      )}
                      <small className="text-muted ml-2">
                        {new Date(post.created_at).toLocaleString()}
                      </small>
                    </div>

                    {user && user.username === loggedInUsername && (
                      <div className="mt-auto">
                        <button
                          onClick={() => {
                            setEditingPostId(post.id);
                          }}
                          className="btn btn-primary btn-sm mt-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="btn btn-danger btn-sm mt-2 ms-2"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="tags">
                      {post.tags.map((tag, index) => (
                        <span key={index}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasNextPage && !loading && (
        <div className="text-center">
          <button onClick={() => setPage(page + 1)} className="btn btn-primary">
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;

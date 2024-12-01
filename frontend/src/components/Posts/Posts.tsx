import React, { useEffect, useState } from "react";
import axios from "axios";

// Define interfaces for Post and User
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author: number; // This links to the User's ID
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
  const [page, setPage] = useState<number>(1); // Current page state
  const [hasNextPage, setHasNextPage] = useState<boolean>(true); // Check if there's a next page

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .get<PaginatedResponse<Post>>(
          `http://localhost:8000/posts/?page=${page}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        )
        .then((response) => {
          const postData = response.data.results; // Paginated results are in `results`
          setPosts((prevPosts) => [...prevPosts, ...postData]); // Append new posts to existing ones
          setHasNextPage(response.data.next !== null); // Check if there are more pages

          // Fetch user data for each post
          postData.forEach((post: Post) => {
            if (!users.has(post.author)) {
              axios
                .get<User>(`http://localhost:8000/accounts/${post.author}/`, {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
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
  }, [page]); // Re-fetch posts whenever page number changes

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const bottom =
      event.currentTarget.scrollHeight ===
      event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (bottom && hasNextPage && !loading) {
      setPage((prevPage) => prevPage + 1); // Go to the next page when scrolled to bottom
    }
  };

  return (
    <div className="container my-5" onScroll={handleScroll}>
      <h2 className="text-center mb-4">Posts</h2>

      {loading && (
        <p className="text-center text-secondary">Loading posts...</p>
      )}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {posts.map((post) => {
          const user = users.get(post.author);
          return (
            <div className="col" key={post.id}>
              <div className="card shadow-sm post-card">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content}</p>
                  <div className="d-flex justify-content-between">
                    {user ? (
                      <div>
                        <img
                          src={user.profile_picture || "/default-profile.png"}
                          alt="Profile"
                          className="rounded-circle"
                          width="40"
                          height="40"
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
                </div>
                <div className="card-footer">
                  <div className="tags">
                    {post.tags.map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
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

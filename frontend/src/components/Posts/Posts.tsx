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
  const [seenPostIds, setSeenPostIds] = useState<Set<number>>(new Set()); // Track seen post IDs
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set()); // Track expanded posts

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setLoading(true); // Start loading when fetching a new page
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

          // Filter out posts that have already been fetched
          const newPosts = postData.filter((post) => !seenPostIds.has(post.id));

          // If there are new posts, update the state
          if (newPosts.length > 0) {
            setPosts((prevPosts) =>
              page === 1 ? newPosts : [...prevPosts, ...newPosts]
            ); // Append new posts on next pages
            setSeenPostIds(
              (prevSeen) =>
                new Set([...prevSeen, ...newPosts.map((post) => post.id)])
            ); // Mark these posts as seen
          }

          setHasNextPage(response.data.next !== null); // Check if there are more pages

          // Fetch user data for each post
          newPosts.forEach((post: Post) => {
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

          setLoading(false); // End loading when fetch is done
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
          setError("Error fetching posts.");
          setLoading(false); // End loading on error
        });
    } else {
      setError("No token found. Please log in.");
      setLoading(false); // End loading if no token is found
    }
  }, [page, seenPostIds]); // Re-fetch posts whenever page number or seenPostIds changes

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const bottom =
      event.currentTarget.scrollHeight ===
      event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (bottom && hasNextPage && !loading) {
      setPage((prevPage) => prevPage + 1); // Go to the next page when scrolled to bottom
    }
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
          const isExpanded = expandedPosts.has(post.id);
          const truncatedContent =
            post.content.length > 50 && !isExpanded
              ? post.content.substring(0, 50) + "..."
              : post.content;

          return (
            <div className="col" key={post.id}>
              <div className="card shadow-sm post-card">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">
                    {truncatedContent}
                    {post.content.length > 50 && !isExpanded && (
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleExpand(post.id)}
                      >
                        See more
                      </span>
                    )}
                  </p>
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

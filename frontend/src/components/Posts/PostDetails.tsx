import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css"; // Import the CSS file

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string;
}

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

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

  if (!post) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="post-details-container">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p className="tags">Tags: {post.tags}</p>
    </div>
  );
};

export default PostDetails;

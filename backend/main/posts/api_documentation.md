---

# **Blog API Documentation**

## **Base URL**

```
http://yourdomain.com/
```

## **Authentication**

All endpoints require authentication to perform actions such as creating, updating, or deleting posts and comments. Include a valid **token** in the request headers for authenticated actions.

## **Endpoints**

---

### **1. Posts Endpoints**

#### **1.1. List all posts**

```
GET /posts/
```

**Description**:  
Retrieve a list of all blog posts. Use the `tag` query parameter to filter posts by specific tags.

**Query Parameters**:

- `tag`: A tag to filter posts by. Provide one tag (e.g., `?tag=django`) or multiple tags (e.g., `?tag=django,python`).

**Response**:

```json
[
  {
    "id": 1,
    "author": "username",
    "title": "Post title",
    "content": "Post content",
    "created_at": "2024-11-25T12:34:56Z",
    "updated_at": "2024-11-25T12:34:56Z",
    "tags": ["django", "python"]
  },
  ...
]
```

---

#### **1.2. Retrieve a single post**

```
GET /posts/{id}/
```

**Description**:  
Retrieve a specific blog post by its ID.

**Response**:

```json
{
  "id": 1,
  "author": "username",
  "title": "Post title",
  "content": "Post content",
  "created_at": "2024-11-25T12:34:56Z",
  "updated_at": "2024-11-25T12:34:56Z",
  "tags": ["django", "python"]
}
```

---

#### **1.3. Search posts by tag**

```
GET /posts/?tag=<tag>
```

**Description**:  
Retrieve all blog posts with a specific tag. You can also filter by multiple tags using a comma-separated format.

**Example Queries**:

- `GET /posts/?tag=django`
- `GET /posts/?tag=django,python`

**Response**:

```json
[
  {
    "id": 1,
    "author": "username",
    "title": "Post about Django",
    "content": "Learn about Django.",
    "created_at": "2024-11-25T12:34:56Z",
    "tags": ["django", "web development"]
  },
  ...
]
```

---

#### **1.4. Create a new post**

```
POST /create/
```

**Description**:  
Create a new blog post. The author is automatically set to the authenticated user.

**Request Body**:

```json
{
  "title": "New Post Title",
  "content": "Content for the new post",
  "tags": ["django", "web development"]
}
```

**Response**:

```json
{
  "id": 2,
  "author": "username",
  "title": "New Post Title",
  "content": "Content for the new post",
  "created_at": "2024-11-25T12:34:56Z",
  "tags": ["django", "web development"]
}
```

---

#### **1.5. Update a post**

```
PUT /posts/{id}/update/
```

**Description**:  
Update a specific post. Only the author of the post can update it.

**Request Body**:

```json
{
  "title": "Updated Post Title",
  "content": "Updated content",
  "tags": ["updated-tag1", "updated-tag2"]
}
```

**Response**:

```json
{
  "id": 1,
  "author": "username",
  "title": "Updated Post Title",
  "content": "Updated content",
  "created_at": "2024-11-25T12:34:56Z",
  "updated_at": "2024-11-25T12:45:00Z",
  "tags": ["updated-tag1", "updated-tag2"]
}
```

---

#### **1.6. Delete a post**

```
DELETE /posts/{id}/delete/
```

**Description**:  
Delete a specific post. Only the author of the post can delete it.

**Response**:

```json
{
  "detail": "Post deleted successfully."
}
```

---

### **2. Comments Endpoints**

```
GET /comments/
```

**Description**:  
Retrieve a list of all comments.

**Response**:

```json
[
  {
    "id": 1,
    "post": 1,
    "author": "username",
    "content": "This is a comment.",
    "created_at": "2024-11-25T12:34:56Z",
    "updated_at": "2024-11-25T12:34:56Z"
  },
  ...
]
```

#### **2.2. Retrieve a single comment**

```
GET /comments/{id}/
```

**Description**:  
Retrieve a specific comment by its ID.

**Response**:

```json
{
  "id": 1,
  "post": 1,
  "author": "username",
  "content": "This is a comment.",
  "created_at": "2024-11-25T12:34:56Z",
  "updated_at": "2024-11-25T12:34:56Z"
}
```

#### **2.3. Create a new comment**

```
POST /comments/create/
```

**Description**:  
Create a new comment. The author is automatically set to the currently authenticated user.

**Request Body**:

```json
{
  "post": 1,
  "content": "This is a new comment."
}
```

**Response**:

```json
{
  "id": 2,
  "post": 1,
  "author": "username",
  "content": "This is a new comment.",
  "created_at": "2024-11-25T12:34:56Z",
  "updated_at": "2024-11-25T12:34:56Z"
}
```

#### **2.4. Update a comment**

```
PUT /comments/{id}/update/
```

**Description**:  
Update a specific comment. Only the author of the comment can update it.

**Request Body**:

```json
{
  "content": "Updated comment content."
}
```

**Response**:

```json
{
  "id": 1,
  "post": 1,
  "author": "username",
  "content": "Updated comment content.",
  "created_at": "2024-11-25T12:34:56Z",
  "updated_at": "2024-11-25T12:45:00Z"
}
```

#### **2.5. Delete a comment**

```
DELETE /comments/{id}/delete/
```

**Description**:  
Delete a specific comment. Only the author of the comment can delete it.

**Response**:

```json
{
  "detail": "Comment deleted successfully."
}
```

## **Permissions**

- **IsAuthor**: A custom permission that ensures only the author of a post or comment can update or delete it.
- Authentication is required for **POST**, **PUT**, and **DELETE** actions.

---

## **Example Requests**

#### **Search posts by a single tag**

```
GET /posts/?tag=django
```

**Response**:

```json
[
  {
    "id": 1,
    "author": "username",
    "title": "Post about Django",
    "content": "Learn about Django.",
    "tags": ["django", "web development"]
  }
]
```

#### **Search posts by multiple tags**

```
GET /posts/?tag=django,python
```

**Response**:

```json
[
  {
    "id": 1,
    "author": "username",
    "title": "Post about Django",
    "content": "Learn about Django.",
    "tags": ["django", "python"]
  },
  {
    "id": 2,
    "author": "username",
    "title": "Post about Python",
    "content": "Learn about Python.",
    "tags": ["python"]
  }
]
```
Here’s the API documentation for the **User Feed** feature:

---

## **User Feed API**

### **Endpoint**:
`GET /feed/`

### **Description**:
This endpoint retrieves a feed of posts from users that the currently authenticated user follows. The posts are ordered by their creation date, with the most recent posts shown first.

### **Permissions**:
- **Authentication Required**: Yes (Authenticated users only)
- **Permissions**: Only the authenticated user can access their feed.

### **Request Headers**:
- **Authorization**: Bearer token of the authenticated user (e.g., `Authorization: Bearer <auth_token>`).

### **Request Parameters**:
- **None** (No query parameters required)

### **Response**:

- **Status Code**: `200 OK` (success)
- **Content-Type**: `application/json`

#### **Response Body** (Success):
```json
[
    {
        "id": 1,
        "title": "Post Title 1",
        "content": "Content of the post",
        "author": "john_doe",
        "created_at": "2024-11-25T10:00:00Z"
    },
    {
        "id": 2,
        "title": "Post Title 2",
        "content": "Content of another post",
        "author": "jane_doe",
        "created_at": "2024-11-24T08:00:00Z"
    }
]
```

#### **Response Fields**:
- **id**: Unique identifier of the post.
- **title**: Title of the post.
- **content**: Content of the post.
- **author**: The username of the post's author.
- **created_at**: The date and time the post was created, in ISO 8601 format.

### **Response Codes**:

- **200 OK**: Successfully retrieved the feed of posts.
- **401 Unauthorized**: The request is missing a valid `Authorization` token, or the token is invalid.
- **404 Not Found**: This status will not be encountered for this endpoint since it retrieves posts from users that the authenticated user follows.

### **Example Request**:
```bash
GET /feed/ HTTP/1.1
Host: api.example.com
Authorization: Bearer <auth_token>
```

### **Example Response**:
```json
[
    {
        "id": 1,
        "title": "Post Title 1",
        "content": "Content of the post",
        "author": "john_doe",
        "created_at": "2024-11-25T10:00:00Z"
    },
    {
        "id": 2,
        "title": "Post Title 2",
        "content": "Content of another post",
        "author": "jane_doe",
        "created_at": "2024-11-24T08:00:00Z"
    }
]
```

---

### **Notes**:
- The feed is ordered by the **`created_at`** timestamp, with the most recent posts appearing first.
- Only posts from users that the authenticated user follows are included in the feed.
- The **Authorization** header must contain a valid Bearer token representing the authenticated user.

This API provides a personalized feed experience based on the users the current user follows.

---

---

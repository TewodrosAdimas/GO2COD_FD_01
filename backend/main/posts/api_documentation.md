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

---

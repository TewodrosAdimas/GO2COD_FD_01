---

# Blog API Documentation

## Base URL

```
http://127.0.0.1:8000/
```

## Authentication

This API uses standard JWT authentication. To authenticate, you'll need to log in to the system.

## Endpoints

### **Posts**

1. **Create a Post**

   - **URL:** `posts/create/`
   - **Method:** `POST`
   - **Request Body:**

     ```json
     {
       "title": "string",
       "content": "string",
       "tags": ["string"]
     }
     ```

   - **Response:**

     - **Status:** `201 Created`
     - **Body:**

       ```json
       {
         "id": 1,
         "author": "string",
         "title": "string",
         "content": "string",
         "created_at": "2024-11-25T12:00:00Z",
         "updated_at": "2024-11-25T12:00:00Z",
         "tags": ["string"]
       }
       ```

2. **Get All Posts**

   - **URL:** `/posts/`
   - **Method:** `GET`
   - **Response:**

     - **Status:** `200 OK`
     - **Body:**

       ```json
       [
         {
           "id": 1,
           "author": "string",
           "title": "string",
           "content": "string",
           "created_at": "2024-11-25T12:00:00Z",
           "updated_at": "2024-11-25T12:00:00Z",
           "tags": ["string"]
         },
         ...
       ]
       ```

3. **Get a Single Post**

   - **URL:** `/posts/{id}/`
   - **Method:** `GET`
   - **Response:**

     - **Status:** `200 OK`
     - **Body:**

       ```json
       {
         "id": 1,
         "author": "string",
         "title": "string",
         "content": "string",
         "created_at": "2024-11-25T12:00:00Z",
         "updated_at": "2024-11-25T12:00:00Z",
         "tags": ["string"]
       }
       ```

4. **Update a Post**

   - **URL:** `/posts/{id}/update/`
   - **Method:** `PUT`
   - **Request Body:**

     ```json
     {
       "title": "string",
       "content": "string",
       "tags": ["string"]
     }
     ```

   - **Response:**

     - **Status:** `200 OK`
     - **Body:**

       ```json
       {
         "id": 1,
         "author": "string",
         "title": "string",
         "content": "string",
         "created_at": "2024-11-25T12:00:00Z",
         "updated_at": "2024-11-25T12:00:00Z",
         "tags": ["string"]
       }
       ```

5. **Delete a Post**
   - **URL:** `/posts/{id}/delete/`
   - **Method:** `DELETE`
   - **Response:**
     - **Status:** `204 No Content`

---

### **Comments**

1. **Create a Comment**

   - **URL:** `posts/comments/create/`
   - **Method:** `POST`
   - **Request Body:**

     ```json
     {
       "post": 1,
       "content": "string"
     }
     ```

   - **Response:**

     - **Status:** `201 Created`
     - **Body:**

       ```json
       {
         "id": 1,
         "author": "string",
         "post": 1,
         "content": "string",
         "created_at": "2024-11-25T12:00:00Z",
         "updated_at": "2024-11-25T12:00:00Z"
       }
       ```

2. **Get All Comments**

   - **URL:** `posts/comments/`
   - **Method:** `GET`
   - **Response:**

     - **Status:** `200 OK`
     - **Body:**

       ```json
       [
         {
           "id": 1,
           "author": "string",
           "post": 1,
           "content": "string",
           "created_at": "2024-11-25T12:00:00Z",
           "updated_at": "2024-11-25T12:00:00Z"
         },
         ...
       ]
       ```

3. **Get a Single Comment**

   - **URL:** `posts/comments/{id}/`
   - **Method:** `GET`
   - **Response:**

     - **Status:** `200 OK`
     - **Body:**

       ```json
       {
         "id": 1,
         "author": "string",
         "post": 1,
         "content": "string",
         "created_at": "2024-11-25T12:00:00Z",
         "updated_at": "2024-11-25T12:00:00Z"
       }
       ```

4. **Update a Comment**

   - **URL:** `posts/comments/{id}/update/`
   - **Method:** `PUT`
   - **Request Body:**

     ```json
     {
       "content": "string"
     }
     ```

   - **Response:**

     - **Status:** `200 OK`
     - **Body:**

       ```json
       {
         "id": 1,
         "author": "string",
         "post": 1,
         "content": "string",
         "created_at": "2024-11-25T12:00:00Z",
         "updated_at": "2024-11-25T12:00:00Z"
       }
       ```

5. **Delete a Comment**
   - **URL:** `posts/comments/{id}/delete/`
   - **Method:** `DELETE`
   - **Response:**
     - **Status:** `204 No Content`

---

## Models

### **Post**

- **author**: Foreign key to the `CustomUser` model (the author of the post).
- **title**: The title of the post (string).
- **content**: The content of the post (text).
- **created_at**: The timestamp when the post was created.
- **updated_at**: The timestamp when the post was last updated.
- **tags**: Tags associated with the post (using `TaggableManager`).

### **Comment**

- **author**: Foreign key to `CustomUser` (the author of the comment).
- **post**: Foreign key to `Post` (the post the comment belongs to).
- **content**: The content of the comment (text).
- **created_at**: The timestamp when the comment was created.
- **updated_at**: The timestamp when the comment was last updated.

---

## Permissions

### **IsAuthor**

This custom permission class ensures that only the author of a post or comment can edit or delete it.

---

## Example Response

Here’s an example of a successful response when getting a post:

```json
{
  "id": 1,
  "author": "JohnDoe",
  "title": "My First Blog Post",
  "content": "This is the content of the post.",
  "created_at": "2024-11-25T12:00:00Z",
  "updated_at": "2024-11-25T12:00:00Z",
  "tags": ["django", "blog"]
}
```

---

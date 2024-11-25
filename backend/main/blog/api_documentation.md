---
# **Blog API Documentation**

This documentation outlines the available endpoints, request methods, required parameters, and expected responses for the Blog API.
---

## **Authentication**

The API uses **Token Authentication** for secure access.  
Include the token in the request header for endpoints that require authentication:  
`Authorization: Token <your_token>`

---

## **Endpoints**

### **1. User Registration**

**URL:** `/register/`  
**Method:** `POST`  
**Description:** Allows users to register a new account.

#### Request Body:

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "securepassword",
  "bio": "This is my bio",
  "profile_picture": null
}
```

#### Response:

- **Success (201 Created):**
  ```json
  {
    "message": "User registered successfully!"
  }
  ```
- **Error (400 Bad Request):**
  ```json
  {
    "username": ["This field is required."],
    "password": ["This field is required."]
  }
  ```

---

### **2. User Login**

**URL:** `/login/`  
**Method:** `POST`  
**Description:** Authenticates a user and returns a token.

#### Request Body:

```json
{
  "username": "testuser",
  "password": "securepassword"
}
```

#### Response:

- **Success (200 OK):**
  ```json
  {
    "token": "your_generated_token"
  }
  ```
- **Error (401 Unauthorized):**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

---

### **3. Fetch User Profile**

**URL:** `/profile/`  
**Method:** `GET`  
**Description:** Retrieves the profile information of the authenticated user.  
**Authentication:** Required (Token)

#### Response:

- **Success (200 OK):**
  ```json
  {
    "id": 1,
    "username": "testuser",
    "email": "testuser@example.com",
    "bio": "This is my bio",
    "profile_picture": "http://localhost:8000/media/profile_pictures/sample.jpg"
  }
  ```
- **Error (401 Unauthorized):**
  ```json
  {
    "detail": "Authentication credentials were not provided."
  }
  ```

---

### **4. Update User Profile**

**URL:** `/profile/`  
**Method:** `PUT`  
**Description:** Updates the authenticated user’s profile.  
**Authentication:** Required (Token)

#### Request Body:

- Provide any fields you wish to update (all fields are optional):

```json
{
  "bio": "Updated bio content",
  "profile_picture": null
}
```

#### Response:

- **Success (200 OK):**
  ```json
  {
    "message": "Profile updated successfully!"
  }
  ```
- **Error (400 Bad Request):**
  ```json
  {
    "bio": ["This field may not be blank."]
  }
  ```
- **Error (401 Unauthorized):**
  ```json
  {
    "detail": "Authentication credentials were not provided."
  }
  ```

---

## **Error Handling**

- **400 Bad Request:** Validation errors or missing/invalid fields.
- **401 Unauthorized:** Authentication token is missing or invalid.
- **404 Not Found:** The requested resource does not exist.

---

## **Setup Notes**

1. **Token Authentication:** Ensure `TokenAuthentication` is added in `settings.py`:
   ```python
   REST_FRAMEWORK = {
        "DEFAULT_AUTHENTICATION_CLASSES": [
            "rest_framework.authentication.TokenAuthentication",
        ],
        "DEFAULT_PERMISSION_CLASSES": [
            "rest_framework.permissions.IsAuthenticated",
        ],
    }
   ```
2. **Run Migrations for Token Models:**

   ```bash
   python manage.py migrate
   ```

3. **Ensure Media File Handling:** Add the following to `settings.py` for handling `profile_picture` uploads:

   ```python
   MEDIA_URL = '/media/'
   MEDIA_ROOT = BASE_DIR / 'media'
   ```

   Update `urls.py` to serve media files in development:

   ```python
   from django.conf import settings
   from django.conf.urls.static import static

   if settings.DEBUG:
       urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
   ```

---


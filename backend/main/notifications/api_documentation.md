### **Notifications API Documentation**

This API provides endpoints for managing user notifications, including fetching all notifications, showcasing unread notifications prominently, and marking notifications as read.

---

### **Endpoints**

#### 1. **Fetch All Notifications**

- **URL**: `/notifications/`
- **Method**: `GET`
- **Authentication**: Required (Token-based authentication)
- **Description**: Retrieves all notifications for the authenticated user. Unread notifications are shown prominently.
- **Response Example**:
  ```json
  {
    "unread_count": 2,
    "notifications": [
      {
        "id": 1,
        "actor": "john_doe",
        "verb": "liked your post",
        "target": "Post Title",
        "is_read": false,
        "timestamp": "2024-11-25T12:45:30.456789Z"
      },
      {
        "id": 2,
        "actor": "jane_smith",
        "verb": "commented on your post",
        "target": "Post Title",
        "is_read": false,
        "timestamp": "2024-11-24T10:15:22.123456Z"
      },
      {
        "id": 3,
        "actor": "alex_user",
        "verb": "started following you",
        "target": null,
        "is_read": true,
        "timestamp": "2024-11-23T14:30:00.789012Z"
      }
    ]
  }
  ```
- **Response Fields**:
  - `unread_count`: Number of unread notifications.
  - `notifications`: List of notifications.
    - `id`: Unique identifier for the notification.
    - `actor`: The username of the user who performed the action.
    - `verb`: A description of the action performed.
    - `target`: The target object of the action (e.g., post title or comment).
    - `is_read`: Boolean indicating whether the notification has been read.
    - `timestamp`: The timestamp of when the notification was created.

---

#### 2. **Mark All Notifications as Read**

- **URL**: `/notifications/mark-read/`
- **Method**: `POST`
- **Authentication**: Required (Token-based authentication)
- **Description**: Marks all unread notifications for the authenticated user as read.
- **Request Body**: None
- **Response Example**:
  ```json
  {
    "message": "All notifications marked as read."
  }
  ```

---

### **Notification Model**

The `Notification` model tracks user notifications and includes the following fields:

- `recipient`: (ForeignKey) The user receiving the notification.
- `actor`: (ForeignKey) The user performing the action.
- `verb`: (CharField) Describes the action (e.g., "liked your post").
- `target`: (GenericForeignKey) The object the notification refers to (e.g., a post or comment).
- `is_read`: (BooleanField) Indicates if the notification has been read (default: `false`).
- `timestamp`: (DateTimeField) The time the notification was created.

---

### **Examples**

#### Fetch Notifications

**Request**:

```http
GET /notifications/
Authorization: Bearer <your_token>
```

**Response**:

```json
{
  "unread_count": 2,
  "notifications": [
    {
      "id": 1,
      "actor": "john_doe",
      "verb": "liked your post",
      "target": "Post Title",
      "is_read": false,
      "timestamp": "2024-11-25T12:45:30.456789Z"
    },
    {
      "id": 2,
      "actor": "jane_smith",
      "verb": "commented on your post",
      "target": "Post Title",
      "is_read": false,
      "timestamp": "2024-11-24T10:15:22.123456Z"
    },
    {
      "id": 3,
      "actor": "alex_user",
      "verb": "started following you",
      "target": null,
      "is_read": true,
      "timestamp": "2024-11-23T14:30:00.789012Z"
    }
  ]
}
```

---

#### Mark Notifications as Read

**Request**:

```http
POST /notifications/mark-read/
Authorization: Bearer <your_token>
```

**Response**:

```json
{
  "message": "All notifications marked as read."
}
```

---

### **Notes**

- Unread notifications are prioritized in the response by sorting them first.
- The `mark-read` endpoint updates the `is_read` field to `true` for all unread notifications.
- Both endpoints require authentication; unauthorized requests will return a `401 Unauthorized` error.

---

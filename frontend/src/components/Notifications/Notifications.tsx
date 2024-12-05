import React, { useEffect, useState } from "react";
import axios from "axios";
import './styles.css';

// Define types for notifications and response
interface Notification {
  id: number;
  actor: string;
  verb: string;
  target: string | null;
  is_read: boolean;
  timestamp: string;
}

interface NotificationsResponse {
  unread_count: number;
  notifications: Notification[];
}

interface MarkReadResponse {
  message: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Axios base URL setup (if your backend is running on a different port or domain)
  axios.defaults.baseURL = "http://localhost:8000"; // Adjust this URL to match your backend's base URL

  // Fetch notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          setError("Authentication token is missing.");
          setLoading(false);
          return;
        }


        const response = await axios.get<NotificationsResponse>("/notifications/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // Debug: Check if the response contains the expected structure

        if (response.data && response.data.notifications) {
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.unread_count);
        } else {
          setError("Notifications data is missing.");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setError("Authentication token is missing.");
        return;
      }


      const response = await axios.post<MarkReadResponse>(
        "/notifications/mark-read/",
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );


      // Update UI to reflect the notifications have been read
      if (response.data.message === "All notifications marked as read.") {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            is_read: true,
          }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      setError("Failed to mark notifications as read.");
    }
  };


  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div>
        <strong>{unreadCount} unread notifications</strong>
        <button onClick={markAllAsRead}>Mark All as Read</button>
      </div>

      {/* Debug: Render a simple check for empty notifications */}
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              style={{
                background: notification.is_read ? "#f0f0f0" : "#fffae5",
              }}
            >
              <p>
                <strong>{notification.actor}</strong> {notification.verb}{" "}
                {notification.target && <em>{notification.target}</em>}
              </p>
              <p>{new Date(notification.timestamp).toLocaleString()}</p>
              {notification.is_read ? <span>(Read)</span> : <span>(Unread)</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

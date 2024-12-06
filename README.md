````markdown
# TedBlog

**TedBlog** is a web application built with Django, Django RESTful API, JWT authentication, React, and TypeScript. It provides users with a platform where they can create, manage, and interact with posts, comments, and notifications in a social media-like environment.

## Features

- **User Registration**: Users can register with a username and password (bio, email, and profile picture are optional).
- **User Login**: Users can log in securely using their username and password.
- **Profile Management**: Users can update their profile after logging in.
- **Post Management**: Users can create, edit, and delete their own posts.
- **Comment Management**: Users can create, edit, and delete their own comments on posts.
- **Likes**: Users can like and unlike posts.
- **Following**: Users can follow and unfollow other users.
- **Global Feed**: Users can view all posts on the platform.
- **Personal Feed**: Users can see posts only from the users they follow.
- **Notifications**: Users receive notifications when someone likes, comments on their post, or follows them.
- **Mark as Read**: Users can mark notifications as read.

## Technologies Used

- **Backend**: Django, Django RESTful API, JWT Authentication
- **Frontend**: React, TypeScript
- **Database**: SQLite (or other, based on your configuration)
- **Authentication**: JWT (JSON Web Tokens) for secure user authentication

## Setup Instructions

### Backend Setup (Django)

1. Clone the repository:
   ```bash
   git clone https://github.com/TewodrosAdimas/GO2COD_FD_01.git
   cd tedblog
   ```
````

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:

   ```bash
   python manage.py migrate
   ```

5. Create a superuser for the admin interface:

   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:

   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`.

### Frontend Setup (React)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required packages:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

## API Endpoints

- **POST** `/api/auth/register/` - Register a new user
- **POST** `/api/auth/login/` - Login and get a JWT token
- **GET** `/api/posts/` - Get all posts
- **POST** `/api/posts/` - Create a new post
- **PUT** `/api/posts/{id}/` - Edit an existing post
- **DELETE** `/api/posts/{id}/` - Delete a post
- **GET** `/api/notifications/` - Get user notifications

For more detailed API documentation, please refer to the backend code.

## Contributing

Contributions are welcome! Please fork the repository, make changes, and create a pull request. If you find any issues, feel free to open an issue ticket.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Django**: The powerful backend framework.
- **React**: For building the frontend.
- **JWT**: For secure authentication.
- Special thanks to **go2code** for inspiring this project!

---

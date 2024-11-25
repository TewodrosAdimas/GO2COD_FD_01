---

# Blog Application

This is a simple blog application built using Django, providing the functionality to create, read, update, and delete blog posts and comments. It also supports tagging posts for better categorization.

## Features

- Create, read, update, and delete blog posts.
- Create, read, update, and delete comments on posts.
- Tag posts with multiple tags.
- Basic user authentication.

## Installation

### Prerequisites

- Python 3.x
- Django 3.x or higher
- Django REST Framework (for API functionality)

### Steps to Install

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TewodrosAdimas/GO2COD_FD_01.git
   cd backend/main
   ```

2. **Create a virtual environment (optional but recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install the required dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations:**

   ```bash
   python manage.py migrate
   ```

5. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

   The application will be running at `http://127.0.0.1:8000/`.

## API Endpoints

- **POST** `/create/`: Create a new post.
- **GET** `/posts/`: Retrieve all posts.
- **GET** `/posts/{id}/`: Retrieve a specific post by ID.
- **PUT** `/posts/{id}/update/`: Update an existing post.
- **DELETE** `/posts/{id}/delete/`: Delete a post.

- **POST** `/comments/create/`: Create a new comment.
- **GET** `/comments/`: Retrieve all comments.
- **GET** `/comments/{id}/`: Retrieve a specific comment.
- **PUT** `/comments/{id}/update/`: Update an existing comment.
- **DELETE** `/comments/{id}/delete/`: Delete a comment.

## Authentication

- The application uses Tooken based authentication. Ensure you are logged in to interact with the API.

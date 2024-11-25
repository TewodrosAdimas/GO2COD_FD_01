### Blog App - README  

#### Overview  
The **Blog App** is responsible for handling user account functionalities, including registration, login, and profile management. It uses Django and Django REST Framework (DRF) for backend operations and provides API endpoints for seamless user authentication and management.  

---

#### Features  
- **User Registration**: Allows users to create accounts.  
- **User Login**: Provides token-based authentication for users.  
- **Profile Management**: Users can view and update their own profiles.  

---

#### Installation  
1. Clone the repository and navigate to the project directory.  
   ```bash  
   git clone https://github.com/TewodrosAdimas/GO2COD_FD_01.git  
   cd backend/main 
   ```  

2. Install the required dependencies.  
   ```bash  
   pip install -r requirements.txt  
   ```  

3. Apply database migrations.  
   ```bash  
   python manage.py makemigrations blog  
   python manage.py migrate  
   ```  

4. Run the development server.  
   ```bash  
   python manage.py runserver  
   ```  

---

#### API Endpoints  
- **`/register/`**  
  - **Method**: POST  
  - **Description**: Register a new user.  
  - **Required Fields**: `username`, `password` (optional: `email`, `bio`, `profile_picture`).  

- **`/login/`**  
  - **Method**: POST  
  - **Description**: Login with `username` and `password` to receive an authentication token.  

- **`/profile/`**  
  - **Method**: GET  
  - **Description**: Retrieve the authenticated user's profile.  
  - **Authentication**: Token required.  

  - **Method**: PUT  
  - **Description**: Update the authenticated user's profile.  
  - **Authentication**: Token required.  

---

#### Directory Structure  
```plaintext  
blog/  
├── migrations/           # Database migrations  
├── templates/            # (Optional) HTML templates for registration/login views  
├── __init__.py           # App initialization  
├── admin.py              # Admin configurations for CustomUser 
├── api_documentation.md  # implementation guideline for user account 
├── apps.py               # App configuration  
├── models.py             # CustomUser model definition  
├── serializers.py        # DRF serializers for user data  
├── urls.py               # URL patterns for user-related endpoints  
└── views.py              # Logic for user registration, login, and profile management  
```  

---

#### Notes  
- Ensure the `rest_framework.authtoken` is included in the project settings under `INSTALLED_APPS`.  
- Refer to `api_documentation.md` for detailed API usage instructions.  

---  

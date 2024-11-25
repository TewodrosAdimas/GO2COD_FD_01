from django.urls import path
from .views import UserRegistrationView, LoginView, UserProfileView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_registration'),
    path('login/', LoginView.as_view(), name='user_login'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),  # User profile management
]

from django.urls import path
from .views import (
    UserRegistrationView,
    LoginView,
    UserProfileView,
    FollowUserView,
    UnfollowUserView,
    AllUsersProfileView,
    UserDetailView,
)
from . import views
from django.contrib.auth.views import LogoutView  # Import the LogoutView

urlpatterns = [
    path(
        "all_profiles/",
        AllUsersProfileView.as_view(),
        name="all_user_profiles",
    ),
    path("profile/<str:username>/", views.profile_view, name="profile"),
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("login/", LoginView.as_view(), name="user-login"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("follow/<str:username>/", FollowUserView.as_view(), name="follow_user"),
    path("unfollow/<str:username>/", UnfollowUserView.as_view(), name="unfollow_user"),
    path("logout/", LogoutView.as_view(), name="user-logout"),  # Add logout path

]

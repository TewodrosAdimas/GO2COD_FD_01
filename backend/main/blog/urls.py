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

urlpatterns = [
    path(
        "all_profiles/",
        AllUsersProfileView.as_view(),
        name="all_user_profiles",
    ),
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("login/", LoginView.as_view(), name="user-login"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("follow/<str:username>/", FollowUserView.as_view(), name="follow_user"),
    path("unfollow/<str:username>/", UnfollowUserView.as_view(), name="unfollow_user"),
]

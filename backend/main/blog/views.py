from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import (
    LoginSerializer,
    UserRegistrationSerializer,
    CustomUserSerializer,
    UserProfileSerializer,
)
from rest_framework.permissions import AllowAny  # This allows unauthenticated access
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.shortcuts import get_object_or_404
from .models import CustomUser
from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authentication import authenticate
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer


class UserDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            user = CustomUser.objects.get(pk=pk)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class AllUsersProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def get(self, request):
        users = CustomUser.objects.exclude(
            id=request.user.id
        )  # Exclude the logged-in user
        serializer = UserProfileSerializer(
            users, many=True, context={"request": request}
        )
        return Response(serializer.data)


class UserRegistrationView(APIView):
    permission_classes = [
        AllowAny
    ]  # Allow unauthenticated users to access registration view
    authentication_classes = []  # No authentication needed for registration

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    View to handle user login and token retrieval.
    """

    permission_classes = [
        AllowAny
    ]  # Allow unauthenticated users to access the login view
    authentication_classes = []  # No authentication needed for login

    def post(self, request):
        """
        Authenticate user and return a token along with username.
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():  # Validates username and password presence
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username, password=password)

            if user:
                # Generate or retrieve the token
                token, _ = Token.objects.get_or_create(user=user)
                return Response(
                    {
                        "token": token.key,
                        "username": user.username,  # Include username in the response
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    View to handle fetching and updating the authenticated user's profile.
    Only the authenticated user can modify their own profile.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def get(self, request):
        """
        Return the profile of the authenticated user along with follower count.
        """
        serializer = UserRegistrationSerializer(request.user)
        # Add follower_count to the response data
        user_data = serializer.data
        user_data["follower_count"] = request.user.follower_count
        return Response(user_data)


class FollowUserView(APIView):
    """
    View to allow users to follow another user.
    Only the authenticated user can follow someone else.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def post(self, request, username):
        """
        Follow a user by username.
        """
        user_to_follow = get_object_or_404(CustomUser, username=username)
        user = request.user  # The currently authenticated user

        if user == user_to_follow:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add the user_to_follow to the authenticated user's following list
        user.following.add(user_to_follow)

        # Trigger notification
        Notification.objects.create(
            recipient=user_to_follow,
            actor=user,
            verb="started following you",
        )

        return Response(
            {"message": f"You are now following {username}."},
            status=status.HTTP_200_OK,
        )


class UnfollowUserView(APIView):
    """
    View to allow users to unfollow another user.
    Only the authenticated user can unfollow someone else.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def post(self, request, username):
        """
        Unfollow a user by username.
        """
        user_to_unfollow = get_object_or_404(CustomUser, username=username)
        user = request.user  # The currently authenticated user

        if user == user_to_unfollow:
            return Response(
                {"error": "You cannot unfollow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Remove the user_to_unfollow from the authenticated user's following list
        user.following.remove(user_to_unfollow)
        return Response(
            {"message": f"You have unfollowed {username}."},
            status=status.HTTP_200_OK,
        )

        # Trigger notification
        Notification.objects.create(
            recipient=user_to_unfollow,
            actor=user,
            verb="started unfollowing you",
        )

from rest_framework.decorators import api_view

@api_view(["GET"])
def profile_view(request, username):
    # Get the user by username
    user = get_object_or_404(CustomUser, username=username)

    # Get the authenticated user (assumes you are using Token-based authentication)
    current_user = request.user

    # Check if the current user is following the target user
    is_following = current_user.following.filter(id=user.id).exists()

    # Return the follow status
    return JsonResponse({"is_following": is_following})

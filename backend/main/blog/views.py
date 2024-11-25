from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import CustomUser


class FollowUserView(APIView):
    """
    View to allow users to follow another user.
    Only the authenticated user can follow someone else.
    """

    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

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
        return Response(
            {"message": f"You are now following {username}."},
            status=status.HTTP_200_OK,
        )


class UnfollowUserView(APIView):
    """
    View to allow users to unfollow another user.
    Only the authenticated user can unfollow someone else.
    """

    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

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

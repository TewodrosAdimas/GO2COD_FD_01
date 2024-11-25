# permissions.py

from rest_framework import permissions


class IsAuthor(permissions.BasePermission):
    """
    Custom permission to only allow authors of a post/comment to edit/delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the author of the post/comment (CustomUser is referenced here)
        return obj.author == request.user

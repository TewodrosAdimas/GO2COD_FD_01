from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from .permissions import IsOwnerOrReadOnly


# Viewset for Post model
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        IsOwnerOrReadOnly
    ]  # Custom permission to allow users to modify their posts only

    def perform_create(self, serializer):
        # Automatically assign the current user as the author when creating a post
        serializer.save(author=self.request.user)

    def get_queryset(self):
        """
        Optionally restricts the returned posts to the currently authenticated user's posts.
        """
        queryset = Post.objects.all()
        if self.request.user.is_authenticated:
            queryset = queryset.filter(author=self.request.user)
        return queryset


# Viewset for Comment model
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [
        IsOwnerOrReadOnly
    ]  # Custom permission to allow users to modify their comments only

    def perform_create(self, serializer):
        # Automatically assign the current user as the author when creating a comment
        post = Post.objects.get(pk=self.request.data.get("post"))
        serializer.save(author=self.request.user, post=post)

    def get_queryset(self):
        """
        Optionally restricts the returned comments to the currently authenticated user's comments.
        """
        queryset = Comment.objects.all()
        if self.request.user.is_authenticated:
            queryset = queryset.filter(author=self.request.user)
        return queryset

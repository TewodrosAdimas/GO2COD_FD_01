# views.py

from rest_framework import generics
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from .permissions import IsAuthor
from django.utils import timezone
from taggit.models import Tag
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q


class UserFeedView(APIView):
    """
    View to return the feed of posts from users that the currently authenticated user follows.
    The posts will be ordered by creation date (most recent first).
    Only authenticated users can access this view.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def get(self, request):
        """
        Get the posts from the users that the authenticated user follows, ordered by creation date.
        """
        user = request.user  # The currently authenticated user

        # Get the users the authenticated user follows
        followed_users = user.following.all()

        # Get the posts from the followed users, ordered by creation date (most recent first)
        posts = Post.objects.filter(Q(author__in=followed_users)).order_by(
            "-created_at"
        )  # Assuming 'created_at' is the field for post creation time

        # Serialize the posts using the PostSerializer
        serializer = PostSerializer(posts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class PostCreateView(generics.CreateAPIView):
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        # Automatically set the logged-in user (CustomUser) as the author
        serializer.save(author=self.request.user)


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        tag = self.request.query_params.get(
            "tag", None
        )  # Get the tag from query params
        if tag:
            queryset = queryset.filter(tags__name__in=[tag])  # Filter posts by the tag
        return queryset


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthor]  # Ensure only the author can update

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now())


class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthor]  # Ensure only the author can delete


class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        # Automatically set the logged-in user (CustomUser) as the author
        serializer.save(author=self.request.user)


class CommentListView(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class CommentDetailView(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class CommentUpdateView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthor]  # Ensure only the author can update

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now())


class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthor]  # Ensure only the author can delete

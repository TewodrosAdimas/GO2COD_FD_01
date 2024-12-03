from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
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
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Post, Like
from blog.models import CustomUser
from rest_framework.pagination import PageNumberPagination


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


# Define a custom pagination class
class PostListPagination(PageNumberPagination):
    page_size = 5  # Set page size to 5
    page_size_query_param = "page_size"
    max_page_size = 100  # Limit maximum page size to 100


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [
        IsAuthenticated
    ]  # Ensure user is authenticated to access posts
    pagination_class = PostListPagination  # Set the custom pagination class

    def get_queryset(self):
        queryset = Post.objects.all()
        tag = self.request.query_params.get(
            "tag", None
        )  # Get the tag from query params
        if tag:
            queryset = queryset.filter(tags__name__in=[tag])  # Filter posts by the tag
        return queryset


# PostCreateView: Requires authentication (only authenticated users can create posts)
class PostCreateView(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]  # Requires authentication

    def perform_create(self, serializer):
        # Automatically set the logged-in user (CustomUser) as the author
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = []  # No authentication required for viewing post details


class PostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        IsAuthenticated,
        IsAuthor,
    ]  # Ensure only the author can update
    # Use the custom permission `IsAuthor` to restrict access

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now())


class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        IsAuthenticated,
        IsAuthor,
    ]  # Ensure only the author can update


class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        user = self.request.user
        comment = serializer.save(author=user)

        # Trigger notification
        Notification.objects.create(
            recipient=comment.post.author,
            actor=user,
            verb="commented on your post",
            target=comment.post,
        )


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


class LikePostView(APIView):
    """
    View to allow users to like a post.
    Only authenticated users can like a post, and they can like a post only once.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def post(self, request, post_id):
        """
        Like a post by post_id.
        If the user has already liked the post, return an error.
        """
        post = get_object_or_404(Post, id=post_id)
        user = request.user  # The currently authenticated user

        # Check if the user has already liked the post
        if Like.objects.filter(post=post, user=user).exists():
            return Response(
                {"error": "You have already liked this post."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create a like for the post
        Like.objects.create(post=post, user=user)

        # Trigger notification
        Notification.objects.create(
            recipient=post.author,
            actor=user,
            verb="liked your post",
            target=post,
        )

        return Response(
            {"message": "Post liked successfully."},
            status=status.HTTP_201_CREATED,
        )


class UnlikePostView(APIView):
    """
    View to allow users to unlike a post.
    Only authenticated users can unlike a post.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def post(self, request, post_id):
        """
        Unlike a post by post_id.
        If the user has not liked the post, return an error.
        """
        post = get_object_or_404(Post, id=post_id)
        user = request.user  # The currently authenticated user

        # Check if the user has liked the post
        like = Like.objects.filter(post=post, user=user).first()
        if not like:
            return Response(
                {"error": "You have not liked this post yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Remove the like for the post
        like.delete()

        # Trigger notification
        Notification.objects.create(
            recipient=post.author,
            actor=user,
            verb="unliked your post",
            target=post,
        )

        return Response(
            {"message": "Post unliked successfully."},
            status=status.HTTP_200_OK,
        )

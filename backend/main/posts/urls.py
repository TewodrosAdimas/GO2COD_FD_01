from django.urls import path
from .views import (
    PostCreateView,
    PostListView,
    PostDetailView,
    PostUpdateView,
    PostDeleteView,
    LikePostView,
    UnlikePostView,
)
from .views import (
    CommentCreateView,
    CommentListView,
    CommentDetailView,
    CommentUpdateView,
    CommentDeleteView,
    UserFeedView,
)

urlpatterns = [
    path("", PostListView.as_view(), name="post-list"),
    path("create/", PostCreateView.as_view(), name="post-create"),
    path("<int:pk>/", PostDetailView.as_view(), name="post-detail"),
    path("<int:pk>/update/", PostUpdateView.as_view(), name="post-update"),
    path("<int:pk>/delete/", PostDeleteView.as_view(), name="post-delete"),
    path("comments/", CommentListView.as_view(), name="comment-list"),
    path("comments/create/", CommentCreateView.as_view(), name="comment-create"),
    path("comments/<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),
    path(
        "comments/<int:pk>/update/", CommentUpdateView.as_view(), name="comment-update"
    ),
    path(
        "comments/<int:pk>/delete/", CommentDeleteView.as_view(), name="comment-delete"
    ),
    path("feed/", UserFeedView.as_view(), name="user_feed"),
    path("like/<int:post_id>/", LikePostView.as_view(), name="like-post"),
    path("unlike/<int:post_id>/", UnlikePostView.as_view(), name="unlike-post"),
]

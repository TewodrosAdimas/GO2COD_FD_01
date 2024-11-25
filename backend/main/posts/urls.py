from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="post")
router.register(r"comments", CommentViewSet, basename="comment")

# Define the URL patterns that map to the viewsets
urlpatterns = [
    path("", include(router.urls)),  # This includes all the generated routes
]

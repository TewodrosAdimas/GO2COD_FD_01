from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("blog.urls")),  # Blog authentication and profile routes
    path("posts/", include("blog.urls")),  # Blog authentication and profile routes
]

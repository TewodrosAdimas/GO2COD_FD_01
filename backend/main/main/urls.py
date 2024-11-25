from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("blog.urls")),
    path("posts/", include("posts.urls")),
    path("notifications/", include("notifications.urls")),
]

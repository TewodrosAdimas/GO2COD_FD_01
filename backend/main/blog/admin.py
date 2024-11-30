from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "bio", "follower_count")
    search_fields = ("username", "email")
    filter_horizontal = (
        "following",
    )  # This will make the following field a multiple select box


admin.site.register(CustomUser, CustomUserAdmin)

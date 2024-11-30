from rest_framework import serializers
from .models import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "password",
            "bio",
            "profile_picture",
            "follower_count",
        ]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            bio=validated_data.get("bio", ""),
            profile_picture=validated_data.get("profile_picture"),
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)  # Mandatory field
    password = serializers.CharField(
        required=True, write_only=True
    )  # Mandatory and hidden in responses


class CustomUserSerializer(serializers.ModelSerializer):
    follower_count = serializers.ReadOnlyField()

    class Meta:
        model = CustomUser
        fields = ["username", "email", "bio", "profile_picture", "follower_count"]

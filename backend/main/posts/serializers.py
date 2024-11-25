from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model

# CustomUser model reference
User = get_user_model()


class PostSerializer(serializers.ModelSerializer):
    # Automatically handle author (ForeignKey to User)
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Post
        fields = ["id", "author", "title", "content", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, data):
        """
        Additional validation (if needed)
        """
        if not data.get("title"):
            raise serializers.ValidationError("Title cannot be empty.")
        return data


class CommentSerializer(serializers.ModelSerializer):
    # Automatically handle author (ForeignKey to User)
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    # Automatically link post
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Comment
        fields = ["id", "post", "author", "content", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, data):
        """
        Additional validation (if needed)
        """
        if not data.get("content"):
            raise serializers.ValidationError("Content cannot be empty.")
        return data

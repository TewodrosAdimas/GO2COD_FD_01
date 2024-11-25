# serializers.py

from rest_framework import serializers
from .models import Post, Comment
from blog.models import CustomUser  # Reference the CustomUser model


from rest_framework import serializers
from .models import Post, Comment
from taggit.serializers import TagListSerializerField, TaggitSerializer


class PostSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()  # This handles the tags

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "title",
            "content",
            "created_at",
            "updated_at",
            "tags",
        )
        read_only_fields = (
            "author",
            "created_at",
            "updated_at",
        )  # 'author' should be read-only


class CommentSerializer(serializers.ModelSerializer):
    author = (
        serializers.StringRelatedField()
    )  # This will display the username or name of the author

    class Meta:
        model = Comment
        fields = "__all__"

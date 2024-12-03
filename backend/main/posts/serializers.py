# serializers.py

from rest_framework import serializers
from .models import Post, Comment
from blog.models import CustomUser  # Reference the CustomUser model


from rest_framework import serializers
from .models import Post, Comment, Like
from taggit.serializers import TagListSerializerField, TaggitSerializer


class PostSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()  # This handles the tags
    is_liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()  
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
            "like_count",
            "is_liked",
        )
        read_only_fields = (
            "author",
            "created_at",
            "updated_at",
        )  # 'author' should be read-only

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Like.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_like_count(self, obj):
        return obj.likes.count()


class CommentSerializer(serializers.ModelSerializer):
    author = (
        serializers.StringRelatedField()
    )  # This will display the username or name of the author

    class Meta:
        model = Comment
        fields = "__all__"

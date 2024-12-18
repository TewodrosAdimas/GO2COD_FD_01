from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="actions"
    )
    verb = models.CharField(max_length=255)  # Describes the action
    timestamp = models.DateTimeField(
        auto_now_add=True
    )  # When the notification was created

    # Using GenericForeignKey to allow targeting any object (like Post, Comment, etc.)
    target_content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, null=True, blank=True
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey("target_content_type", "target_object_id")
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.actor} {self.verb} {self.target} at {self.timestamp}"

    class Meta:
        ordering = ["-timestamp"]  # Order notifications by most recent



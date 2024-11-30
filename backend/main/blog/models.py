from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)  # Optional bio field for the user.
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )  # Profile picture for the user.

    # Following relationship: A user can follow other users. 'symmetrical=False' ensures it's not a mutual relationship (i.e., if user A follows user B, it doesn't automatically mean user B follows user A).
    following = models.ManyToManyField(
        "self", symmetrical=False, related_name="followers", blank=True
    )

    @property
    def follower_count(self):
        """Method to count the number of followers."""
        return self.followers.count()

    def __str__(self):
        return self.username

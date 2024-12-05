from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Notification


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(recipient=user).order_by(
            "-is_read", "-timestamp"
        )  # Prioritize unread notifications

        # Get unread count
        unread_count = notifications.filter(is_read=False).count()

        response_data = [
            {
                "actor": n.actor.username,
                "verb": n.verb,
                "target": str(n.target) if n.target else None,
                "is_read": n.is_read,
                "timestamp": n.timestamp,
            }
            for n in notifications
        ]

        # Return unread_count and notifications
        return Response(
            {"unread_count": unread_count, "notifications": response_data},
            status=status.HTTP_200_OK,
        )


class MarkNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(
            is_read=True
        )
        return Response(
            {"message": "All notifications marked as read."}, status=status.HTTP_200_OK
        )

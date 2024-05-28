from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class CreateNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def create_notification(self, from_user, to_user, message):
        notification = Notification.objects.create(
            user=to_user, message=message)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{to_user.id}",
            {
                'type': 'send_notification',
                'message': message
            }
        )

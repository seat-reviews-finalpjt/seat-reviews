from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.shortcuts import render
from accounts.models import User


class CreateNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def create_notification(self, from_user, user, message):
        notification = Notification.objects.create(
            user=user, message=message)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{user.id}",
            {
                'type': 'send_notification',
                'message': message
            }
        )


def notification_view(request):
    notifications = Notification.objects.filter(user=request.user)
    return render(request, 'notification_list.html', {'notifications': notifications})

from django.shortcuts import render
from .models import Notification


def notification_list(request):
    notifications = Notification.objects.filter(
        user=request.user, is_read=False)
    return render(request, 'notifications.html', {'notifications': notifications})

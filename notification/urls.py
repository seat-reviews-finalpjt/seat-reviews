from django.urls import path
from .views import CreateNotificationView
from . import views

urlpatterns = [
    path('create/', CreateNotificationView.as_view(), name='create_notification'),
]

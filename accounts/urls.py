from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path("signup/", views.UserJoinView.as_view()),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
]
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path("signup/", views.UserJoinView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", views.TokenBlacklistView.as_view(), name="logout"),
    path("<str:username>/", views.DeleteUserView().as_view(), name="delete_user"),
]
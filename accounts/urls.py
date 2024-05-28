from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

app_name= 'accounts'

urlpatterns = [
    path("signup/", views.UserJoinView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", views.TokenBlacklistView.as_view(), name="logout"),
    path('', views.kakaoMain, name='kakao'),
    path('kakaoLoginLogic/', views.kakaoLoginLogic),
    path('kakaoLoginLogicRedirect/', views.kakaoLoginLogicRedirect),
    path('kakaoLogout/', views.kakaoLogout),
    path("<str:username>/", views.UserProfileView().as_view(), name="delete_user"),
]
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

app_name = 'accounts'

urlpatterns = [
    path("signup/", views.UserJoinView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", views.TokenBlacklistView.as_view(), name="logout"),
    path('', views.kakaoMain, name='kakao'),
    path('kakaoLoginLogic/', views.kakao_login),
    path('kakaoLoginLogicRedirect/', views.kakao_login_redirect),
    path('kakaoLogout/', views.kakao_logout),
    path("<str:username>/", views.UserProfileView.as_view(), name="user_profile"),
    # path("current/", views.CurrentUserView.as_view(), name="current_user"),  # 현재 사용자 정보를 반환하는 엔드포인트
]

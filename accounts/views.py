from django.contrib import messages
from django.contrib.auth import login
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenBlacklistView as OriginalTokenBlacklistView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404, render, redirect
from .models import User
import requests
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse, HttpResponseRedirect
from django.core.files import File
from django.conf import settings
import os
from django.contrib.auth.hashers import check_password
import urllib.parse
from django.contrib.auth import get_user_model
import logging

class UserJoinView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            messages.success(request, f'회원가입이 완료되었습니다. 환영합니다, {user.username}님!')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


User = get_user_model()

class CurrentUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_anonymous:
            return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)



User = get_user_model()

class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        logging.info("Entering UserProfileView.get")
        logging.info(f"Request user: {request.user}")
        user = request.user
        if user.is_anonymous:
            return Response({"detail": "No User matches the given query."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        logging.info(f"Returning user: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, username=None, *args, **kwargs):
        if username:
            user = get_object_or_404(User, username=username)
        else:
            user = request.user
        if request.user != user:
            return Response({"message": "본인만 프로필을 수정할 수 있습니다."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, username=None, *args, **kwargs):
        if username:
            user = get_object_or_404(User, username=username)
        else:
            user = request.user
        if request.user != user:
            return Response({"message": "본인이 아니면 탈퇴할 수 없습니다."}, status=status.HTTP_403_FORBIDDEN)
        
        user.delete()
        return Response({"message": "계정이 삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)





class TokenBlacklistView(OriginalTokenBlacklistView):
    def post(self, request, *args, **kwargs):
        print(f"Request data: {request.data}")
        print(f"Request headers: {request.headers}")
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return Response({"message": "리플래쉬 토큰이 블랙리스트에 추가되었습니다."}, status=status.HTTP_205_RESET_CONTENT)
        return response


@ensure_csrf_cookie
def kakaoMain(request):
    _context = {'check': False}
    if request.session.get('access_token'):
        _context['check'] = True
    return render(request, 'kakaoMain.html', _context)


def kakao_login(request):
    print("Redirecting to Kakao login")
    kakao_rest_api_key = '48e792a6240b4c3c3d5caf671271328f'
    redirect_uri = 'http://localhost:8000/accounts/kakaoLoginLogicRedirect'
    kakao_auth_url = f"https://kauth.kakao.com/oauth/authorize?client_id={kakao_rest_api_key}&redirect_uri={redirect_uri}&response_type=code"
    return redirect(kakao_auth_url)



def kakao_login_redirect(request):
    print("Handling Kakao login redirect")
    code = request.GET.get('code')
    kakao_rest_api_key = '48e792a6240b4c3c3d5caf671271328f'
    redirect_uri = 'http://localhost:8000/accounts/kakaoLoginLogicRedirect'
    token_url = f"https://kauth.kakao.com/oauth/token"

    token_data = {
        'grant_type': 'authorization_code',
        'client_id': kakao_rest_api_key,
        'redirect_uri': redirect_uri,
        'code': code,
    }

    token_res = requests.post(token_url, data=token_data)
    token_json = token_res.json()

    print(f"Token response: {token_json}")

    if 'access_token' not in token_json:
        return JsonResponse({'error': 'Access token not found in the response'}, status=400)

    kakao_access_token = token_json['access_token']
    request.session['kakao_access_token'] = kakao_access_token

    user_info_url = 'https://kapi.kakao.com/v2/user/me'
    headers = {'Authorization': f'Bearer {kakao_access_token}'}
    user_info_res = requests.get(user_info_url, headers=headers)

    print(f"User info response: {user_info_res.json()}")

    if user_info_res.status_code != 200:
        return JsonResponse({'error': 'Failed to retrieve user info from Kakao'}, status=user_info_res.status_code)

    user_info = user_info_res.json()
    print(f"User info: {user_info}")

    kakao_id = user_info.get('id')
    if not kakao_id:
        return JsonResponse({'error': 'Kakao ID not found in the response'}, status=400)

    properties = user_info.get('properties', {})
    nickname = properties.get('nickname', f'User{kakao_id}')
    kakao_profile_image = properties.get('profile_image', None)

    try:
        user = User.objects.get(username=kakao_id)
    except User.DoesNotExist:
        user = User(username=kakao_id, nickname=nickname)
        user.set_unusable_password()  # 비밀번호 없이 생성

        # 기본 프로필 이미지 설정
        if kakao_profile_image:
            user.profile_image = kakao_profile_image
        else:
            default_image_path = os.path.join(settings.BASE_DIR, 'media', 'default_profile_image.png')
            with open(default_image_path, 'rb') as f:
                user.profile_image.save('default_profile_image.png', File(f), save=False)
        
        user.save()

    login(request, user)

    # Generate JWT token for the user
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    encoded_nickname = urllib.parse.quote(user.nickname)  # 닉네임을 URL 인코딩

    response = HttpResponseRedirect('http://localhost:3000/')
    response.set_cookie('username', user.username, domain='localhost', samesite='None', secure=True)
    response.set_cookie('nickname', encoded_nickname, domain='localhost', samesite='None', secure=True)
    response.set_cookie('auth_provider', 'kakao', domain='localhost', samesite='None', secure=True)
    response.set_cookie('token', access_token, domain='localhost', samesite='None', secure=True)
    response.set_cookie('refresh_token', refresh_token, domain='localhost', samesite='None', secure=True)

    print("Cookies set:", response.cookies)
    return response


def kakao_logout(request):
    kakao_access_token = request.session.get('kakao_access_token')
    if kakao_access_token:
        logout_request = requests.post(
            "https://kapi.kakao.com/v1/user/logout",
            headers={"Authorization": f"Bearer {kakao_access_token}"},
        )
        if logout_request.status_code == 200:
            # 로그아웃이 성공했을 때
            response = HttpResponseRedirect("http://localhost:3000/")
            response.delete_cookie('username', domain='localhost', path='/', samesite='None')
            response.delete_cookie('nickname', domain='localhost', path='/', samesite='None')
            response.delete_cookie('auth_provider', domain='localhost', path='/', samesite='None')
            response.delete_cookie('token', domain='localhost', path='/', samesite='None')
            response.delete_cookie('refresh_token', domain='localhost', path='/', samesite='None')
            if 'kakao_access_token' in request.session:
                del request.session['kakao_access_token']
            return response
        else:
            return JsonResponse({'error': 'Failed to log out from Kakao'}, status=logout_request.status_code)
    else:
        return HttpResponseRedirect("http://localhost:3000/")




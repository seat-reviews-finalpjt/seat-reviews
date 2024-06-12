from django.contrib import messages
from django.contrib.auth import login
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
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


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            if request.user.username == username:
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                data = {
                    "username": serializer.data['username'],
                    "profile_image": serializer.data['profile_image']
                }
                return Response(data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "해당 사용자를 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, username, *args, **kwargs):
        if request.user.username != username:
            return Response({"message": "본인이 아니면 탈퇴할 수 없습니다."}, status=status.HTTP_403_FORBIDDEN)
        password = request.data.get('password')
        if not password or not check_password(password, request.user.password):
            return Response({"detail": "잘못된 비밀번호입니다."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.delete()
        return Response({"detail": "회원 탈퇴가 완료되었습니다."}, status=status.HTTP_204_NO_CONTENT)


class TokenBlacklistView(OriginalTokenBlacklistView):
    def post(self, request, *args, **kwargs):
        print(f"Request data: {request.data}")
        print(f"Request headers: {request.headers}")
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return Response({"message": "리플래쉬 토큰이 블랙리스트에 추가되었습니다."}, status=status.HTTP_205_RESET_CONTENT)
        return response


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
    token_url = f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={kakao_rest_api_key}&redirect_uri={redirect_uri}&code={code}"

    token_res = requests.post(token_url)
    token_json = token_res.json()

    print(f"Token response: {token_json}")

    if 'access_token' not in token_json:
        return JsonResponse({'error': 'Access token not found in the response'}, status=400)

    access_token = token_json['access_token']
    request.session['access_token'] = access_token

    user_info_url = 'http://kapi.kakao.com/v2/user/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_info_res = requests.get(user_info_url, headers=headers)

    # 상태 코드 확인 및 에러 처리 추가
    if user_info_res.status_code != 200:
        return JsonResponse({'error': 'Failed to retrieve user info from Kakao'}, status=user_info_res.status_code)

    user_info = user_info_res.json()

    print(f"User info response: {user_info}")

    kakao_id = user_info.get('id')
    if not kakao_id:
        return JsonResponse({'error': 'Kakao ID not found in the response'}, status=400)

    properties = user_info.get('properties', {})
    nickname = properties.get('nickname', f'User{kakao_id}')

    try:
        user = User.objects.get(username=kakao_id)
    except User.DoesNotExist:
        user = User.objects.create(username=kakao_id, nickname=nickname)

    login(request, user)
    response = HttpResponseRedirect('http://localhost:3000/')
    response.set_cookie('username', nickname, samesite='None', secure=True)
    response.set_cookie('auth_provider', 'kakao', samesite='None', secure=True)
    response.set_cookie('token', access_token, samesite='None', secure=True)

    print("Cookies set:", response.cookies)
    return response


def kakao_logout(request):
    access_token = request.session.get('access_token')
    if access_token:
        logout_request = requests.post(
            "http://kapi.kakao.com/v1/user/logout",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response = HttpResponseRedirect("http://localhost:3000/")
        response.delete_cookie('username', samesite='None', secure=True)
        response.delete_cookie('auth_provider', samesite='None', secure=True)
        response.delete_cookie('token', samesite='None', secure=True)
        del request.session['access_token']
        return response
    else:
        return HttpResponseRedirect("http://localhost:3000/")

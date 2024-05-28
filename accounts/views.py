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
            # 로그인한 사용자와 요청한 사용자가 동일한 경우, 모든 정보 리턴
            if request.user.username == username:
                return Response(serializer.data, status=status.HTTP_200_OK)
            # 다른 사용자의 프로필 요청인 경우, 유저네임, 프로필 이미지만 리턴
            else:
                data = {
                    "username": serializer.data['username'],
                    "profile_image": serializer.data['profile_image']
                }
                return Response(data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "해당 사용자를 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, username, *args, **kwargs):
        # 요청한 사용자가 로그인된 사용자와 동일한지 확인
        if request.user.username != username:
            return Response({"message": "본인이 아니면 탈퇴할 수 없습니다."}, status=status.HTTP_403_FORBIDDEN)
        # 비밀번호 검증
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
    _context = {'check':False}
    if request.session.get('access_token'):
        _context['check'] = True
    return render(request, 'kakaoMain.html', _context)

def kakaoLoginLogic(request):
    _restApiKey = '' # 입력필요
    _redirectUrl = 'http://127.0.0.1:8000/accounts/kakaoLoginLogicRedirect'
    _url = f'https://kauth.kakao.com/oauth/authorize?client_id={_restApiKey}&redirect_uri={_redirectUrl}&response_type=code'
    return redirect(_url)


def kakaoLoginLogicRedirect(request):
    _qs = request.GET.get('code')
    _restApiKey = ''  # 입력 필요
    _redirect_uri = 'http://127.0.0.1:8000/accounts/kakaoLoginLogicRedirect'
    _url = f'https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={_restApiKey}&redirect_uri={_redirect_uri}&code={_qs}'
    _res = requests.post(_url)
    _result = _res.json()

    # 세션에 토큰 저장
    request.session['access_token'] = _result['access_token']
    request.session.modified = True

    # 사용자 정보 요청
    user_info_url = 'https://kapi.kakao.com/v2/user/me'
    headers = {'Authorization': f'Bearer {_result["access_token"]}'}
    user_info_res = requests.get(user_info_url, headers=headers)
    user_info = user_info_res.json()

    # 사용자 정보 확인 및 Django 사용자 생성/업데이트
    kakao_id = user_info.get('id')
    properties = user_info.get('properties', {})
    username = properties.get('nickname', f'User{kakao_id}')

    try:
        user = User.objects.get(username=kakao_id)
    except User.DoesNotExist:
        user = User.objects.create(username=kakao_id, nickname=username)

    # 로그인 처리
    login(request, user)

    return render(request, 'loginSuccess.html')



def kakaoLogout(request):
    _token = request.session['access_token']
    _url = 'https://kapi.kakao.com/v1/user/logout'
    _header = {
      'Authorization': f'bearer {_token}'
    }
    # _url = 'https://kapi.kakao.com/v1/user/unlink'
    # _header = {
    #   'Authorization': f'bearer {_token}',
    # }
    _res = requests.post(_url, headers=_header)
    _result = _res.json()
    if _result.get('id'):
        del request.session['access_token']
        return render(request, 'loginoutSuccess.html')
    else:
        return render(request, 'logoutError.html')
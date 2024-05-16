from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenBlacklistView as OriginalTokenBlacklistView
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import User

class UserJoinView(APIView):
    permission_classes = [AllowAny]  # 모든 요청 허용
    authentication_classes = []
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return Response({"message": "리플래쉬 토큰이 블랙리스트에 추가되었습니다."}, status=status.HTTP_205_RESET_CONTENT)
        return response
    


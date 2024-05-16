from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenBlacklistView as OriginalTokenBlacklistView
from rest_framework.permissions import AllowAny

class UserJoinView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return Response({"message": "리플래쉬 토큰이 블랙리스트에 추가되었습니다."}, status=status.HTTP_205_RESET_CONTENT)
        return response


from rest_framework import status
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenBlacklistView as OriginalTokenBlacklistView


class UserJoinView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TokenBlacklistView(OriginalTokenBlacklistView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return Response({"message": "리플래쉬 토큰이 블랙리스트에 추가되었습니다."}, status=status.HTTP_205_RESET_CONTENT)
        return response

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, username):
    if request.user.username != username:
        return Response({'error': '당신은 탈퇴하려는 회원 본인이 아닙니다.'}, status=status.HTTP_403_FORBIDDEN)

    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.delete_user(user, serializer.validated_data)
        return Response({'message': '회원 탈퇴가 완료되었습니다.'}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

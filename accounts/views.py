from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, DynamicUserSerializer
from .models import User

class ProfileAPIView(APIView):
    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer_context = {'request': request}
        if request.user.is_authenticated and request.user == user:
            serializer = UserSerializer(user, context=serializer_context)
        else:
            serializer = DynamicUserSerializer(user, context=serializer_context)
        return Response(serializer.data)
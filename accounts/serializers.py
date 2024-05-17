from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class DynamicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'profile_image']
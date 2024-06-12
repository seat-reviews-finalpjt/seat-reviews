from rest_framework import serializers
from .models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email", "name", "nickname", "gender", "birthday", "profile_image"]
        extra_kwargs = {
            "password": {"write_only": True}
        }  # 비밀번호 필드를 읽기 전용으로 설정

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            nickname=validated_data['nickname'],
            name=validated_data['name'],
            gender=validated_data['gender'],
            birthday=validated_data['birthday'],
            profile_image=validated_data.get('profile_image')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

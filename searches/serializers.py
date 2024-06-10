from rest_framework import serializers
from articles.models import Theater

class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = ['id', 'name', 'location', 'description']  # 'id' 필드 포함

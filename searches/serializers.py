from rest_framework import serializers
from articles.models import Theater

class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = ['name', 'location', 'description']
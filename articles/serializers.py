from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Theater, Seat, Review, Comment

User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    author_profile_image = serializers.SerializerMethodField()
    photo = serializers.ImageField(required=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'seat', 'photo', 'author', 'author_profile_image', 'created_at', 'updated_at', 'content', 'score', 'author_id']
        read_only_fields = ['author', 'created_at', 'updated_at']

    def get_author(self, obj):
        return obj.author.nickname

    def get_author_profile_image(self, obj):
        if obj.author.profile_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.author.profile_image.url)
        return None

    def get_photo(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url'):
            photo_url = obj.photo.url
            return request.build_absolute_uri(photo_url)
        return None


class CommentSerializer(serializers.ModelSerializer):
    commenter = serializers.SerializerMethodField()
    commenter_id = serializers.IntegerField(source='commenter.id', read_only=True)
    review = serializers.PrimaryKeyRelatedField(queryset=Review.objects.all())

    class Meta:
        model = Comment
        fields = ['id', 'review', 'commenter', 'commenter_id', 'content', 'created_at', 'updated_at']
        read_only_fields = ['commenter', 'created_at', 'updated_at']

    def get_commenter(self, obj):
        return obj.commenter.nickname


class SeatSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_score = serializers.FloatField(read_only=True)

    class Meta:
        model = Seat
        fields = ['id', 'row', 'number', 'status', 'x', 'y', 'reviews', 'average_score']


class TheaterSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Theater
        fields = ['id', 'name', 'location', 'description', 'seats']

from rest_framework import serializers
from .models import Theater, Seat, Review, Comment
from accounts.models import User

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'seat', 'photo', 'author', 'created_at', 'updated_at', 'content', 'score']
        read_only_fields = ['author', 'created_at', 'updated_at']

    def get_author(self, obj):
        return obj.author.nickname  # nickname을 반환

class CommentSerializer(serializers.ModelSerializer):
    commenter = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'review', 'commenter', 'content', 'created_at', 'updated_at']
        read_only_fields = ['commenter', 'created_at', 'updated_at']

    def get_commenter(self, obj):
        return obj.commenter.nickname  # nickname을 반환

class SeatSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Seat
        fields = ['id', 'row', 'number', 'status', 'x', 'y', 'reviews']


class TheaterSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Theater
        fields = ['id', 'name', 'location', 'description', 'seats']

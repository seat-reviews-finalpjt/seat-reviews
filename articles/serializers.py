from .models import Theater, Seat
from rest_framework import serializers, viewsets
from rest_framework import serializers
from .models import Article, Comment


class ArticleSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Article
        fields = ['id', 'title', 'photo', 'description', 'author_username', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'article', 'commenter', 'content','created_at', 'updated_at', 'parent_comment']
        read_only_fields = ['commenter', 'article']

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent_comment=obj)
        return CommentSerializer(replies, many=True).data



class SeatSerializer(serializers.ModelSerializer):
    reviews = ArticleSerializer(many=True, read_only=True)

    class Meta:
        model = Seat
        fields = '__all__'



class TheaterSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Theater
        fields = '__all__'



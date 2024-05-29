from .models import Theater, Seat, Review
from rest_framework import serializers, viewsets
from rest_framework import serializers
# from .models import Article, Comment,


# class ArticleSerializer(serializers.ModelSerializer):
#     author_username = serializers.ReadOnlyField(source='author.username')

#     class Meta:
#         model = Article
#         fields = ['id', 'title', 'photo', 'description', 'author_username', 'created_at']


# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = ['id', 'article', 'commenter', 'content','created_at', 'updated_at', 'parent_comment']
#         read_only_fields = ['commenter', 'article']

#     def get_replies(self, obj):
#         replies = Comment.objects.filter(parent_comment=obj)
#         return CommentSerializer(replies, many=True).data


class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = ['id', 'name', 'location', 'description']


class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'row', 'number', 'x_position',
                  'y_position', 'is_available', 'width', 'height']


class TheaterSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Theater
        fields = ['id', 'name', 'location', 'description', 'seats']

# 05.29 오전 회의 상황 반영 사용 / 확인 필요


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'photo', 'author', 'content',
                  'created_at', 'updated_at', 'score']

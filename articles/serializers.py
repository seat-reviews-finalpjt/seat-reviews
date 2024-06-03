from .models import Theater, Seat, Review, Comment
from rest_framework import serializers, viewsets
from rest_framework import serializers
# from .models import Article, Comment,


# class ArticleSerializer(serializers.ModelSerializer):
#     author_username = serializers.ReadOnlyField(source='author.username')

#     class Meta:
#         model = Article
#         fields = ['id', 'title', 'photo', 'description', 'author_username', 'created_at']


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


class ReviewSerializer(serializers.ModelSerializer):
    seat = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    score = serializers.ChoiceField(choices=Review.SCORE_CHOICES)

    class Meta:
        model = Review
        fields = ['id', 'seat', 'photo', 'author',
                  'created_at', 'updated_at', 'content', 'score']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'review', 'commenter',
                  'content', 'created_at', 'updated_at']
        read_only_fields = ['commenter', 'review']

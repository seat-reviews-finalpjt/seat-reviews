from rest_framework import serializers
from .models import Article, Comment


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'photo',
                  'description', 'author', 'created_at']
        read_only_fields = ['author', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'article', 'commenter',
                  'content', 'created_at', 'updated_at', 'parent_comment']
        read_only_fields = ['commenter', 'article']

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent_comment=obj)
        return CommentSerializer(replies, many=True).data

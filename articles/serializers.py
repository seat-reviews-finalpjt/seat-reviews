from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'article_id',
                  'commenter_id', 'created_at', 'updated_at']

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent_comment=obj)
        return CommentSerializer(replies, many=True).data

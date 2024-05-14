from django.db import models
from django.conf import settings


class Article(models.Model):
    pass


class Comment(models.Model):
    content = models.CharField(max_length=100)
    article_id = models.ForeignKey(
        Article, related_name='comments', on_delete=models.CASCADE)
    commenter_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

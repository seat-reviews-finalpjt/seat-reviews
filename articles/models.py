from django.db import models
from django.conf import settings
from rest_framework import permissions


class Article(models.Model):
    pass


class Comment(models.Model):
    content = models.CharField(max_length=100)
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE)
    commenter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent_comment = models.ForeignKey(
        'self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')

    def __str__(self):
        return self.content

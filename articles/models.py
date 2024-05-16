from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import permissions


class Article(models.Model):
    title = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='photos/')
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ArticlesLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')


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


class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')

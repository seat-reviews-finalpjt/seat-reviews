from django.db import models
from accounts.models import User
from django.conf import settings
from rest_framework import permissions


# class Article(models.Model):
#     title = models.CharField(max_length=255)
#     photo = models.ImageField(upload_to='photos/')
#     description = models.TextField()
#     author = models.ForeignKey(
#         settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # User 모델 참조
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title

#     @property
#     def author_username(self):
#         return self.author.username


# class ArticlesLike(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     article = models.ForeignKey(Article, on_delete=models.CASCADE)
#     liked_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('user', 'article')


# class Comment(models.Model):
#     content = models.CharField(max_length=100)
#     article = models.ForeignKey(
#         Article, on_delete=models.CASCADE)
#     commenter = models.ForeignKey(
#         settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     parent_comment = models.ForeignKey(
#         'self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')

#     def __str__(self):
#         return self.content


# class CommentLike(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
#     liked_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('user', 'comment')  # 중복 방지


class Theater(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Seat(models.Model):
    theater = models.ForeignKey(
        Theater, related_name='seats', on_delete=models.CASCADE)
    row = models.CharField(max_length=10)
    number = models.IntegerField()
    x_position = models.FloatField()
    y_position = models.FloatField()
    is_available = models.BooleanField(default=True)
    width = models.FloatField(default=20)
    height = models.FloatField(default=20)

    def __str__(self):
        return f"{self.theater.name} - Row {self.row}, Seat {self.number}"

# 05.29 오전 회의 상황 반영 사용 / 확인 필요


class Review(models.Model):
    SCORE_CHOICES = [
        (1, '1점'),
        (2, '2점'),
        (3, '3점'),
        (4, '4점'),
        (5, '5점'),
    ]
    photo = models.ImageField(upload_to='photos/')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # User 모델 참조
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.CharField(max_length=500)
    score = models.IntegerField(choices=SCORE_CHOICES)
#   parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')

    def __str__(self):
        return self.content


class ReviewLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    review = models.ForeignKey(User, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'review')

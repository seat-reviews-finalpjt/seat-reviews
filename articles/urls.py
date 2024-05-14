from django.contrib import admin
from django.urls import path
from .views import CommentListAPIView

urlpatterns = [
    path("<int:article_pk>/", CommentListAPIView.as_view(), name="comment_list"),
    path("<int:article_pk>/comments/",
         CommentListAPIView.as_view(), name="comment_list"),
]

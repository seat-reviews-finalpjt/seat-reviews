from django.contrib import admin
from django.urls import path
from .views import CommentListAPIView, CommentDetailAPIView

urlpatterns = [
    path("<int:article_pk>/", CommentListAPIView.as_view(), name="comment_list"),
    path("<int:article_pk>/comments/",
         CommentListAPIView.as_view(), name="comment_list"),
    path("<int:article_pk>/comments/<int:comment_pk>",
         CommentDetailAPIView.as_view(), name="comment_list"),

]  # 글 CRUD 과정에서 URL 수정 필수!

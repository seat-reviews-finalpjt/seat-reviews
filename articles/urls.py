from django.urls import path
from .views import ArticleList, ArticleDetail, ArticleLikeUnlike, CommentListAPIView, CommentDetailAPIView, CommentLikeUnlikeAPIView

urlpatterns = [
    path('', ArticleList.as_view(), name='article-list'),
    path('<int:pk>/', ArticleDetail.as_view(), name='article-detail'),
    path('<int:pk>/like/', ArticleLikeUnlike.as_view(),
         name='article-like-unlike'),
    path('<int:article_pk>/comments/',
         CommentListAPIView.as_view(), name='comment-list'),
    path('<int:article_pk>/comments/<int:comment_pk>/',
         CommentDetailAPIView.as_view(), name='comment-detail'),
    path('<int:article_pk>/comments/<int:comment_pk>/like/',
         CommentLikeUnlikeAPIView.as_view(), name='article-like-unlike'),
]

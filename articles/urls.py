from django.urls import path
from .views import ArticleList, ArticleDetail, ArticleLikeUnlike, CommentListAPIView, CommentDetailAPIView, CommentLikeUnlikeAPIView, TheaterViewSet, SeatViewSet


urlpatterns = [
     path('', ArticleList.as_view(), name='article-list'),
     path('<int:pk>/', ArticleDetail.as_view(), name='article-detail'),
     path('<int:pk>/like/', ArticleLikeUnlike.as_view(), name='article-like-unlike'),
     path('<int:article_pk>/comments/', CommentListAPIView.as_view(), name='comment-list'),
     path('<int:article_pk>/comments/<int:comment_pk>/', CommentDetailAPIView.as_view(), name='comment-detail'),
     path('<int:article_pk>/comments/<int:comment_pk>/like/', CommentLikeUnlikeAPIView.as_view(), name='comment-like-unlike'),
     path('theaters/', TheaterViewSet.as_view({'get': 'list'}), name='theater-list'),  # 극장 목록에 대한 URL 설정
     path('theaters/<int:pk>/', SeatViewSet.as_view({'get': 'list'}), name='seat-map'),  # 특정 극장의 좌석 목록에 대한 URL 설정
]

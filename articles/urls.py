from django.urls import path
from .views import TheaterViewSet, SeatViewSet, ReviewListAPIView, ReviewDetailAPIView, ReviewLikeUnlikeAPIView, CommentListAPIView, CommentDetailAPIView, CommentLikeUnlikeAPIView

urlpatterns = [
    path('', ReviewListAPIView.as_view(), name='-list'),
    path('<int:pk>/', ReviewDetailAPIView.as_view(), name='article-detail'),
    path('<int:pk>/like/', ReviewLikeUnlikeAPIView.as_view(),
         name='article-like-unlike'),
    path('<int:review_pk>/comments/',
         CommentListAPIView.as_view(), name='comment-list'),
    path('<int:review_pk>/comments/<int:comment_pk>/',
         CommentDetailAPIView.as_view(), name='comment-detail'),
    path('<int:review_pk>/comments/<int:comment_pk>/like/',
         CommentLikeUnlikeAPIView.as_view(), name='article-like-unlike'),
    #  path('<int:article_id>/commenttest/',
    #      comment_view, name='comment-view'),
    # 극장 목록에 대한 URL 설정
    path('theaters/',
         TheaterViewSet.as_view({'get': 'list'}), name='theater-list'),
    # 특정 극장의 좌석 목록에 대한 URL 설정
    path('theaters/<int:pk>/',
         SeatViewSet.as_view({'get': 'list'}), name='seat-map'),
]

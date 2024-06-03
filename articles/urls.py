from django.urls import path
from .views import TheaterViewSet, SeatViewSet, ReviewListAPIView, ReviewDetailAPIView, CommentListAPIView, CommentDetailAPIView

urlpatterns = [
    path('reviews/', ReviewListAPIView.as_view({'get': 'list', 'post': 'create'}), name='review-list'),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='review-detail'),
    path('reviews/<int:review_pk>/comments/', CommentListAPIView.as_view({'get': 'list', 'post': 'create'}), name='comment-list'),
    path('reviews/<int:review_pk>/comments/<int:pk>/', CommentDetailAPIView.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='comment-detail'),
    path('theaters/', TheaterViewSet.as_view({'get': 'list'}), name='theater-list'),
    path('theaters/<int:pk>/', SeatViewSet.as_view({'get': 'list'}), name='seat-map'),
]

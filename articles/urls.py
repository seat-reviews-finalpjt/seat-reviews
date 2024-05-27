from django.urls import path, include
from .views import ArticleList, ArticleDetail, ArticleLikeUnlike, CommentListAPIView, CommentDetailAPIView, CommentLikeUnlikeAPIView
from rest_framework.routers import DefaultRouter
from .views import TheaterViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'theaters', TheaterViewSet)

urlpatterns = [
    path('', ArticleList.as_view(), name='article-list'),
    path('<int:pk>/', ArticleDetail.as_view(), name='article-detail'),
    path('<int:pk>/like/', ArticleLikeUnlike.as_view(), name='article-like-unlike'),
    path('<int:article_pk>/comments/', CommentListAPIView.as_view(), name='comment-list'),
    path('<int:article_pk>/comments/<int:comment_pk>/', CommentDetailAPIView.as_view(), name='comment-detail'),
    path('<int:article_pk>/comments/<int:comment_pk>/like/', CommentLikeUnlikeAPIView.as_view(), name='comment-like-unlike'),
    path('', include(router.urls)),  # Router를 통해 Theater 엔드포인트 추가
]

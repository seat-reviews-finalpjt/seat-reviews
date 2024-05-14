from django.urls import path
from .views import ArticleList, ArticleDetail, ArticleLikeUnlike

urlpatterns = [
    path('', ArticleList.as_view(), name='article-list'),
    path('<int:pk>/', ArticleDetail.as_view(), name='article-edit'),
    path('<int:pk>/like/', ArticleLikeUnlike.as_view(), name='article-like-unlike'),
]
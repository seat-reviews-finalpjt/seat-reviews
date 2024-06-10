# search/urls.py
from django.urls import path
from .views import SearchView, RecommendView, RecordClickView


urlpatterns = [
    path('', SearchView.as_view(), name='search'),
    path('recommends/', RecommendView.as_view(), name='movie-recommend'),
    path('record-click/<int:theater_id>/', RecordClickView.as_view(), name='record-click'),
]

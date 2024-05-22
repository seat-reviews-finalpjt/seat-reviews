# search/urls.py
from django.urls import path
from .views import SearchView
# ,RecommendationView

urlpatterns = [
    path('', SearchView.as_view(), name='search'),
    # path('recommendations/', RecommendationView.as_view(), name='recommendations'),
]
from rest_framework.views import APIView
from rest_framework.response import Response
from articles.models import Article
from articles.serializers import ArticleSerializer
from .models import SearchHistory
from .serializers import SearchHistorySerializer
from transformers import pipeline

class SearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        
        # 데이터베이스에서 제목에 해당 쿼리가 포함된 Article 객체를 필터링
        articles = Article.objects.filter(title__icontains=query)
        serializer = ArticleSerializer(articles, many=True)
        
        # 검색 기록을 데이터베이스에 저장
        search_history = SearchHistory(query=query)
        search_history.save()
        
        # Hugging Face Transformers를 사용하여 사용자 추천 알고리즘 구현
        text_generator = pipeline('text-generation', model='gpt2')
        recommendations = text_generator(f"Based on the search query '{query}', here are some movie recommendations:", max_length=100, num_return_sequences=3)
        
        return Response({'articles': serializer.data, 'recommendations': recommendations})


from rest_framework.views import APIView
from rest_framework.response import Response
from articles.models import Article
from articles.serializers import ArticleSerializer
from .models import SearchHistory
from .serializers import SearchHistorySerializer
from rest_framework.permissions import IsAuthenticated
import openai
import os
from dotenv import load_dotenv

class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get('q', '')
        
        # 데이터베이스에서 제목에 해당 쿼리가 포함된 Article 객체를 필터링
        articles = Article.objects.filter(title__icontains=query)
        serializer = ArticleSerializer(articles, many=True)
        
        # 인증된 사용자인지 확인
        user = request.user
        
        # 검색 기록을 데이터베이스에 저장
        search_history = SearchHistory(query=query, user=user)
        search_history.save()
        
        return Response({'articles': serializer.data})
    
load_dotenv()
    
class RecommendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search_histories = SearchHistory.objects.filter(user=user).order_by('-created_at')
        queries = [history.query for history in search_histories]

        # 최신 검색 기록을 기반으로 추천
        recent_queries = queries[:5]  # 최근 5개의 검색어만 사용
        combined_query = " ".join(recent_queries)

        # OpenAI API를 사용하여 영화 추천
        openai.api_key = os.getenv("OPENAI_API_KEY")
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"사용자가 최근 검색한 영화 키워드는: {combined_query}. 유저의 성향을 한줄로 간략히 요약한 뒤, 이 유저가 좋아할만한 영화 제목만 3개 return해줘. return할 문장들은 총 150토큰을 넘으면 안돼."}
        ]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150
        )

        recommendations = response.choices[0].message['content'].strip().split("\n")
        recommended_movies = [{title.strip()} for title in recommendations if title.strip()]

        return Response(recommended_movies)
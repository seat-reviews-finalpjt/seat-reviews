from rest_framework.views import APIView
from rest_framework.response import Response
from articles.models import Article
from articles.serializers import ArticleSerializer
from .models import SearchHistory
from .serializers import SearchHistorySerializer
from rest_framework.permissions import IsAuthenticated


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

# class RecommendationView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         search_histories = SearchHistory.objects.filter(user=user).values_list('query', flat=True)

#         if search_histories:
#             queries = ' '.join(search_histories)

#             # Hugging Face Transformers를 사용하여 사용자 추천 알고리즘 구현
#             text_generator = pipeline('text-generation', model='gpt2')
#             prompt = f"'{queries}', 이 데이터를 알고리즘으로, 이 유저가 좋아할 만한 영화를 3개 추천해줘. 한국어로 제목만 줬으면 좋겠어."
#             recommendations = text_generator(prompt, max_new_tokens=100, num_return_sequences=3)

#             return Response({'recommendations': recommendations})
#         else:
#             return Response({'recommendations': []})

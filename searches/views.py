from rest_framework.views import APIView
from rest_framework.response import Response
from articles.models import Theater, Review, Seat
from .models import SearchHistory
from .serializers import TheaterSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.shortcuts import get_object_or_404
import openai
import os
from dotenv import load_dotenv


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get('q', '')

        # 데이터베이스에서 name 또는 location에 해당 쿼리가 포함된 Theater 객체를 필터링
        theaters = Theater.objects.filter(name__icontains=query) | Theater.objects.filter(location__icontains=query)
        serializer = TheaterSerializer(theaters, many=True)

        return Response({'theaters': serializer.data})

class RecordClickView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, theater_id):
        # 사용자가 선택한 극장을 검색
        theater = get_object_or_404(Theater, id=theater_id)

        # 인증된 사용자 정보 가져오기
        user = request.user

        # 검색 기록에 저장
        search_history = SearchHistory(query=theater.name, user=user, theater=theater)
        search_history.save()

        return Response({'message': '검색 기록이 잘 저장되었습니다'})
    
load_dotenv()

class RecommendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search_histories = SearchHistory.objects.filter(user=user).order_by('-created_at')

        # 최근 검색한 극장 위치 5개 가져오기
        recent_theaters = (search_histories
                           .values('query')
                           .annotate(count=Count('query'))
                           .order_by('-count')[:5])
        
        if not recent_theaters:
            return Response({"error": "최근 검색한 극장 위치가 없습니다."})

        # 검색 횟수가 가장 많은 극장 위치 선택
        popular_theater_query = recent_theaters[0]['query']
        theater = Theater.objects.filter(location__icontains=popular_theater_query).first()
        
        if not theater:
            return Response({"error": "검색된 극장이 없습니다."})

        # 선택된 극장의 좌석 중 평점이 높은 좌석 찾기
        top_seat_reviews = (Review.objects
                            .filter(seat__theater=theater)
                            .values('seat', 'seat__row', 'seat__number', 'score')
                            .annotate(avg_score=Count('score'))
                            .order_by('-avg_score')[:5])

        seat_info_list = [
            {
                "seat": f"{seat['seat__row']}{seat['seat__number']}",
                "score": seat['avg_score']
            }
            for seat in top_seat_reviews
        ]

        if not seat_info_list:
            # 좌석 리뷰가 없을 경우 OpenAI에게 임의의 자리 추천을 요청
            messages = [
                {"role": "system", "content": "당신은 도움이 되는 어시스턴트입니다."},
                {"role": "user", "content": f"사용자가 최근 검색한 극장 위치는 다음과 같습니다: {popular_theater_query}. 이 극장에서 추천할만한 좌석 하나를 알려주세요."}
            ]
        else:
            # 좌석 리뷰가 있을 경우 OpenAI에게 최고 평점 좌석 추천을 요청
            messages = [
                {"role": "system", "content": "당신은 도움이 되는 어시스턴트입니다."},
                {"role": "user", "content": f"사용자가 최근 검색한 극장 위치는 다음과 같습니다: {popular_theater_query}. 여기 해당 극장의 좌석들과 그들의 평점 정보입니다: {seat_info_list}. 이 좌석들 중에서 가장 좋은 좌석을 추천해주고, 짧은 설명을 덧붙여주세요."}
            ]
        
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150
        )

        recommendation = response.choices[0].message['content'].strip()

        return Response({"recommendation": recommendation})
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Theater, Seat, Review, Comment
from .serializers import TheaterSerializer, SeatSerializer, ReviewSerializer, CommentSerializer


class ReviewListAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request):
        seat_id = request.query_params.get('seat')
        if seat_id:
            reviews = Review.objects.filter(seat_id=seat_id)
        else:
            reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)  # 서버 로그에 에러 출력
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def retrieve(self, request, pk=None):
        review = get_object_or_404(Review, pk=pk)
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data)

    def update(self, request, pk=None):
        review = get_object_or_404(Review, pk=pk)
        serializer = ReviewSerializer(review, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        review = get_object_or_404(Review, pk=pk)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentListAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, review_pk=None):
        comments = Comment.objects.filter(review=review_pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def create(self, request, review_pk=None):
        serializer = CommentSerializer(data=request.data)
        review = get_object_or_404(Review, pk=review_pk)
        if serializer.is_valid():
            comment = serializer.save(commenter=request.user, review=review)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CommentDetailAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def retrieve(self, request, review_pk=None, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def update(self, request, review_pk=None, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, review_pk=None, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer


class SeatViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        theater = get_object_or_404(Theater, pk=pk)
        seats = Seat.objects.filter(theater=theater)
        theater_serializer = TheaterSerializer(theater, context={'request': request})
        seat_serializer = SeatSerializer(seats, many=True, context={'request': request})
        data = theater_serializer.data
        data['seats'] = seat_serializer.data
        return Response(data)


from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Article, ArticlesLike, Comment
from .serializers import ArticleSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView




#게시글 작성 및 목록 조회
class ArticleList(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [permissions.AllowAny] # permissions.IsAuthenticated 테스트 해보려고 아무나 가능하도록 해놨음
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# 게시글 수정 및 삭제
class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # permissions.IsAuthenticated 테스트 해보려고 아무나 가능하도록 해놨음


#게시글 좋아요 기능
class ArticleLikeUnlike(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny] # permissions.IsAuthenticated 테스트 해보려고 아무나 가능하도록 해놨음

    def put(self, request, *args, **kwargs):
        article = self.get_object()
        user = request.user
        like, created = ArticlesLike.objects.get_or_create(user=user, article=article)
        if not created:
            return Response({"detail": "이미 좋아요 되어있는 게시물입니다."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "좋아요 완료!"}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        article = self.get_object()
        user = request.user
        like = get_object_or_404(ArticlesLike, user=user, article=article)
        like.delete()
        return Response({"detail": "게시글 안좋아요 완료!"}, status=status.HTTP_204_NO_CONTENT)
      

class CommentListAPIView(APIView):
    def get(self, request):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        parent_comment_id = request.data.get('parent_comment_id')
        serializer = CommentSerializer(data=request.data)

        if parent_comment_id:  # 대댓글인 경우
            try:
                parent_comment = Comment.objects.get(pk=parent_comment_id)
            except Comment.DoesNotExist:
                return Response({"error": "상위 댓글이 존재하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

            if serializer.is_valid():
                serializer.save(parent_comment=parent_comment)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:  # 일반 댓글인 경우
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailAPIView(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        comment = self.get_object(pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk):
        comment = self.get_object(pk)
        serializer = CommentSerializer(comment, data=request.data)
        self.check_object_permissions(request, comment)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = self.get_object(pk)
        self.check_object_permissions(request, comment)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

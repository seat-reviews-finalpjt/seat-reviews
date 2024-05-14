from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Article, ArticlesLike
from .serializers import ArticleSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404


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
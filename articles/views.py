from rest_framework import generics, permissions
from .models import Article
from .serializers import ArticleSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly


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
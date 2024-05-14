from rest_framework import generics, permissions
from .models import Article
from .serializers import ArticleSerializer


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

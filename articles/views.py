from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Article, ArticlesLike, Comment, CommentLike
from .serializers import ArticleSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from .permissions import IsOwnerOrReadOnly
from notification.views import CreateNotificationView


# 게시글 작성 및 목록 조회
class ArticleList(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            # permissions.IsAuthenticated 테스트 해보려고 아무나 가능하도록 해놨음
            self.permission_classes = [permissions.AllowAny]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# 게시글 수정 및 삭제
class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    # permissions.IsAuthenticated 테스트 해보려고 아무나 가능하도록 해놨음
    permission_classes = [IsAuthenticatedOrReadOnly]


# 게시글 좋아요 기능
class ArticleLikeUnlike(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    # permissions.IsAuthenticated 테스트 해보려고 아무나 가능하도록 해놨음
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        article = self.get_object()
        user = request.user
        like, created = ArticlesLike.objects.get_or_create(
            user=user, article=article)
        notification_view = CreateNotificationView()
        # 알림 생성
        notification_view.create_notification(
            from_user=request.user,
            user=article.author,
            message=f'당신의 글에 좋아요가 달렸습니다.'
        )
        if not created:
            return Response({"detail": "이미 좋아요 되어있는 게시물입니다."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "좋아요 완료!"}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        article = self.get_object()
        user = request.user
        like = get_object_or_404(ArticlesLike, user=user, article=article)
        like.delete()
        return Response({"detail": "게시글 안좋아요 완료!"}, status=status.HTTP_204_NO_CONTENT)


# 댓글 작성 및 목록 조회
class CommentListAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, article_pk):
        comments = Comment.objects.filter(article=article_pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, article_pk):
        parent_comment_id = request.data.get('parent_comment_id')
        serializer = CommentSerializer(data=request.data)
        article = get_object_or_404(Article, pk=article_pk)
        notification_view = CreateNotificationView()  # 알림

        if parent_comment_id:  # 대댓글인 경우
            try:
                parent_comment = Comment.objects.get(pk=parent_comment_id)
            except Comment.DoesNotExist:
                return Response({"error": "상위 댓글이 존재하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)
            if serializer.is_valid():
                comment = serializer.save(
                    commenter=request.user, parent_comment=parent_comment, article=article)
                # 알림 생성
                notification_view.create_notification(
                    from_user=request.user,
                    user=parent_comment.commenter,
                    message=f'당신의 댓글에 새로운 댓글이 달렸습니다.: {comment.content}'
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:  # 일반 댓글인 경우
            if serializer.is_valid():
                comment = serializer.save(
                    commenter=request.user, article=article)
                # 알림 생성
                notification_view.create_notification(
                    from_user=request.user,
                    user=article.author,
                    message=f'당신의 글에 새로운 댓글이 달렸습니다.: {comment.content}'
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 댓글 수정 및 삭제
class CommentDetailAPIView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_object(self, article_pk, comment_pk):
        try:
            return Comment.objects.get(pk=comment_pk)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, article_pk, comment_pk):
        comment = self.get_object(article_pk, comment_pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, article_pk, comment_pk):
        comment = self.get_object(article_pk, comment_pk)
        self.check_object_permissions(request, comment)  # Check permissions
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, article_pk, comment_pk):
        comment = self.get_object(article_pk, comment_pk)
        self.check_object_permissions(request, comment)  # Check permissions
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# 댓글 좋아요 기능


class CommentLikeUnlikeAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, article_pk, comment_pk):
        try:
            comment = Comment.objects.get(pk=comment_pk)
        except Comment.DoesNotExist:
            return Response({"error": "댓글이 존재하지 않습니다."})

        user = request.user
        notification_view = CreateNotificationView()
        # 알림 생성
        notification_view.create_notification(
            from_user=request.user,
            user=comment.author,
            message=f'당신의 댓글에 좋아요가 달렸습니다.'
        )

        if CommentLike.objects.filter(user=user, comment=comment).exists():
            return Response({"error": "이미 좋아요 되어있는 게시물입니다."})

        like = CommentLike(user=user, comment=comment)
        like.save()

        return Response({"message": "좋아요 완료!"})

    def delete(self, request, article_pk, comment_pk):
        try:
            comment = Comment.objects.get(pk=comment_pk)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = request.user

        like = get_object_or_404(CommentLike, user=user, comment=comment)
        like.delete()
        return Response({"detail": "댓글 안좋아요 완료!"}, status=status.HTTP_204_NO_CONTENT)


def comment_view(request, article_id):

    article = get_object_or_404(Article, pk=article_id)
    comments = Comment.objects.filter(article=article)
    context = {'article': article, 'comments': comments}

    return render(request, 'comment.html', context)

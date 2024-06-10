from django.db import models
from accounts.models import User
from articles.models import Theater

class SearchHistory(models.Model):
    query = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} searched {self.query}'
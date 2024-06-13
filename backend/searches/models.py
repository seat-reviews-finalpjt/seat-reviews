from django.db import models
from accounts.models import User

class SearchHistory(models.Model):
    query = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
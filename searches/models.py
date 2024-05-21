from django.db import models

class SearchHistory(models.Model):
    query = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

# search/serializers.py

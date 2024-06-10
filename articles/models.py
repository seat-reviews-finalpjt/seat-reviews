from django.db import models
from django.conf import settings
from django.db.models import Avg

class Theater(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Seat(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name='seats')
    row = models.CharField(max_length=1)
    number = models.IntegerField()
    status = models.IntegerField(choices=[(0, 'Unavailable'), (1, 'Available'), (2, 'Limited')])
    x = models.IntegerField()
    y = models.IntegerField()
    
    def __str__(self):
        return f'{self.row}{self.number}'
    
    @property
    def average_score(self):
        reviews = Review.objects.filter(seat=self)
        if reviews.exists():
            return reviews.aggregate(Avg('score'))['score__avg']
        return 0  # 리뷰가 없으면 0을 반환


class Review(models.Model):
    SCORE_CHOICES = [
        (1, '1점'),
        (2, '2점'),
        (3, '3점'),
        (4, '4점'),
        (5, '5점'),
    ]
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.CharField(max_length=500)
    score = models.IntegerField(choices=SCORE_CHOICES)

    def __str__(self):
        return self.content


class Comment(models.Model):
    content = models.CharField(max_length=100)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    commenter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content

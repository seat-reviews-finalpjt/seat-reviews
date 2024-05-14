from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    GENDER_CHOICES = [
        ("male", "남성"),
        ('female', '여성'),
        ("other", "또 다른 성"),
    ]
    nickname=models.CharField(max_length=20, unique = True)
    name=models.CharField(max_length=10)
    gender=models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    birthday=models.DateField(null=True, blank=True)
    
    
    def __str__(self):
        return self.username
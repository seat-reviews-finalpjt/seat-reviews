from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    GENDER_CHOICES = {
        ("male", "남성"),
        ('female','여성'),
        ("order", "또 다른 성"),
    }
    nickname=models.CharField(max_length=20, unique = True)
    name=models.CharField(max_length=10)
    gender=models.CharField(choices=GENDER_CHOICES, blank=True)
    birthday=models.DateField(auto_now=False, auto_now_add=False, blank=True)
    
    
    def __str__(self):
        return self.username
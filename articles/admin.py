from django.contrib import admin
from .models import Theater, Seat, Review

@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'description']

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ['theater', 'row', 'number', 'status']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['seat', 'author', 'score', 'created_at']
from django.contrib import admin
from django.urls import path, include, re_path
from . import views

from rest_framework import routers

# urlpatterns = [
#     re_path('movies', views.fetch_movies),
#     re_path('movie', views.create_movie),
#     re_path('profile/<str:username>/movies', views.fetch_movies),
# ]


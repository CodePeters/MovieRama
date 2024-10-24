"""
URL configuration for movierama project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from . import views
from movies.views import fetch_movies, create_movie, fetch_profile_movies, submit_action

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('movies', fetch_movies),
    path('movie', create_movie),
    path('profile/movie/<int:movie_id>/review', submit_action),
    path('profile/<str:username>/movies',fetch_profile_movies),
    path('profile/<int:user_id>',views.fetch_profile_info),
    re_path('login', views.login),
    re_path('signup', views.signup),
    re_path('verify_token', views.verify_token),
    re_path('user_details', views.get_user_details)
]

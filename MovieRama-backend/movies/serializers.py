from rest_framework import serializers
from .models import Movie, Review
from django.contrib.auth.models import User
from movierama.serializers import UserSerializer
from movierama.serializers import UserMinifiedDetailsSerializer

import datetime

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields =  '__all__'

# class CustomUserSerializer(serializers.ModelSerializer):
#     class Meta(object):
#         model = User
#         fields = ['id', 'username', 'email']

class MovieSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True) 
    review = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields =  ('id', 'title', 'description', 'user', 'date', 'hates', 'likes', 'review')

    def get_review(self, movie):
        user_id = self.context.get("user_id")
        review_list = ReviewSerializer(Review.objects.filter(user=user_id, movie=movie.id), many=True).data
        if len(review_list):   
            return review_list[0]['review']
        return None



# class MinifiedMovieSerializer(serializers.ModelSerializer):
#     # review = ReviewSerializer(read_only=True)
#     # user = UserMinifiedDetailsSerializer(read_only = True) 

#     class Meta:
#         model = Movie
#         fields =  ('id', 'title', 'description', 'user', 'date', 'hates', 'likes')

from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import Movie, Review
from django.db import transaction
from django.db.models import F
import datetime
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import MovieSerializer, ReviewSerializer
from rest_framework import status

import logging
logger = logging.getLogger(__name__)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def fetch_movies(request):
	movie_list = Movie.objects.all()
	serializer = MovieSerializer(movie_list, many=True, context={'user_id': request.user.id})
	return Response({"movie_list":serializer.data})
		

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def fetch_profile_movies(request, username):
	user = get_object_or_404(User, username=username)
	movie_list = Movie.objects.filter(user=user)
	serializer = MovieSerializer(movie_list, many=True, context={'user_id': request.user.id})
	return Response({"movie_list":serializer.data})


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_movie(request):
	serializer = MovieSerializer(data=request.data)
	serializer.date = datetime.datetime.now().date()
	if serializer.is_valid():
		serializer.save(user=request.user)
		return Response('Success!')
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def submit_action(request, movie_id):
	user_id = request.user.id
	action = request.data['action']
	make_transactions(user_id=user_id, movie_id=movie_id, action=action)
	return Response("Sucess")

def make_transactions(user_id, movie_id, action):
	user = User.objects.get(id=user_id)
	movie = Movie.objects.get(id=movie_id)
	with transaction.atomic():
		if action == 'Like':
			review_record = Review(user=user, movie=movie, review='L')
			review_record.save()
			Movie.objects.filter(id=movie_id).update(likes=F('likes') + 1)
		elif action == 'Hate':
			review_record = Review(user=user, movie=movie, review='H')
			review_record.save()
			Movie.objects.filter(id=movie_id).update(hates=F('hates') + 1)
		elif action == 'UnLike':
			Review.objects.filter(user=user, movie=movie).delete()
			Movie.objects.filter(id=movie_id).update(likes=F('likes') - 1)
		elif action == 'UnHate':
			Review.objects.filter(user=user, movie=movie).delete()
			Movie.objects.filter(id=movie_id).update(hates=F('hates') - 1)

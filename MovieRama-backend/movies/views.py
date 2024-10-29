from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination

from .models import Movie, Review
from .serializers import MovieSerializer

from elasticsearch_dsl import Q
from elasticsearch_dsl import Search

import logging
import datetime

logger = logging.getLogger(__name__)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def fetch_movies(request, username=None):
	search = request.query_params.get("search", None)
	if search:
		query = Search(index='movie').query(Q("multi_match",query=search, fields=["title"], fuzziness="auto"))
		hit_list = query.execute()
		# movie_list = Movie.objects.filter(movie_list)
		movie_list_ids = []
		for hit in hit_list:
			movie_list_ids.append(hit['id'])
			
		id_tuple = tuple(movie_list_ids)
		movie_list = Movie.objects.filter(id__in=id_tuple)

	else:
		if username:
			user = get_object_or_404(User, username=username)
			movie_list = Movie.objects.filter(user=user)
		else:
			movie_list = Movie.objects.all()
	
	ordering = request.query_params.get("ordering", None)
	if ordering:
		movie_list = movie_list.order_by(ordering)

	paginator = LimitOffsetPagination()
	result_page = paginator.paginate_queryset(movie_list, request)
	count = paginator.count
	serializer = MovieSerializer(result_page, many=True, context={'user_id': request.user.id})
	return Response({"movie_list":serializer.data, "count": count})
	

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

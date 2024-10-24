from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response

from .serializers import UserSerializer, UserMinifiedDetailsSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework import permissions, viewsets
import logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
def login(request):
	unauthorized_response = Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
	try:
		user = get_object_or_404(User, username=request.data['username'])
	except:
		return unauthorized_response
	if not user.check_password(request.data['password']):
		return unauthorized_response
	token, _ = Token.objects.get_or_create(user=user)
	serializer = UserSerializer(instance=user)
	return Response({'token': token.key, 'user': serializer.data})


@api_view(['POST'])
def signup(request):
	serializer = UserSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		user = User.objects.get(username=request.data['username'])
		user.set_password(request.data['password'])
		user.save()
		return Response("Success!")
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def verify_token(request):
	return Response("Success!")


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_details(request):
	token, _ = Token.objects.get_or_create(user=request.user)
	serializer = UserSerializer(instance=request.user)
	return Response({'token': token.key, 'user': serializer.data})


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def fetch_profile_info(request, user_id):
	user = get_object_or_404(User, id=user_id)
	serializer = UserMinifiedDetailsSerializer(instance=user)
	return Response(serializer.data)


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
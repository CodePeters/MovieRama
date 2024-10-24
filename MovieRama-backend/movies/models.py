from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse # Used to generate URLs by reversing the URL patterns
# import datetime
from django.utils import timezone 

class Movie(models.Model):
	"""Model representing a Movie entity"""
	title = models.CharField(max_length=200)
	description = models.TextField(help_text='Enter a brief description of the movie')
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	date = models.DateField("date published", default=timezone.now)
	hates = models.IntegerField(default=0)
	likes = models.IntegerField(default=0)


class Review(models.Model):
	user = models.ForeignKey(User, on_delete=models.PROTECT)
	movie = models.ForeignKey(Movie, on_delete=models.PROTECT)
	options = (
		('L', 'likes'),
		('H', 'hates'),
	)
	review = models.CharField(max_length=1, choices=options)

	class Meta:
		unique_together = ("user", "movie")
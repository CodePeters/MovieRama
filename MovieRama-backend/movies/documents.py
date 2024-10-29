from .models import Movie 
from django.contrib.auth.models import User


from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry


@registry.register_document
class MovieDocument(Document):
    user = fields.ObjectField(properties={
        'username': fields.TextField(),
        'id': fields.IntegerField(),
    })

    class Index:
        # Name of the Elasticsearch index
        name = 'movie'
        # See Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Movie # The model associated with this Document

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'title',
            'description',
            'date',
            'hates',
            'likes',
            'id',
        ]
        related_models = [User]
        ignore_signals = False

    def get_instances_from_related(self, tag_instance):
        return tag_instance.movie_set.all()
# MovieRama
A Movie Platform (2024)

## _Tech Stack_ 

* Python3
* Django & Django-Rest Framework  
* Django jwt Auth
* SQLite
* Angular 18
* Angular Material, Ng-Bootsrap
* Cloudflare worker (serverless)
* Cloudflare KV (Cache)
* ElasticSearch

## _Installation_
After git clone `cd` to the cloned repo: `cd ./MovieRama` and run `install.sh`.

- This installs dependencies including Elasticsearch, now run Elastic: `./elasticsearch-8.11.4/bin/elasticsearch` , Once done you will see a **password** that Elasticsearch generates, we need this for next step.
  
- Now for Django to use elasticsearch edit the settings file in: `MovieRama-backend/movierama/settings.py` (line 160) and add the previous password:

```
ELASTICSEARCH_DSL={
    'default': {
        'hosts': 'https://localhost:9200',
        "http_auth": ("elastic", "YOUR_ELASTICSEARC_GENERATED_PASSWORD"),
...
    },
}
```

We are almost there!:  
Open another terminal and run:

- `python manage.py search_index --rebuild`
- `python manage.py runserver`

Now the backend should be up and running!, For the Frontend, in a new term:

- `cd ../movie-app-frontend`
- `ng serve`

Everything at this point should is up and running! App is served in `http://localhost:4200/`

##

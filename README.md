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
  
- Now for Django to use elasticsearch edit the settings file in: `MovieRama-backend/movierama/settings.py` (line 160) and add t

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

The project also uses a serveless component for a feature, that is deployed in cloudflare and the worker code in in wrangler project folder, no setup is required. Also, as a best practise for scaling, sorting is done in the backend and we also have pagination for our endpoints. I also have added logging and Logs are generated inside  `./MovieRama-backend` folder.

### I have also included a png file  (`Scalable_System_design`) with an 'ideal' scalable system design architecture using serverless architecture, also in `ScalableSystem_Explanation` you will find some explanation about the architecture design.

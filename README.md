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
After git clone `cd` to the cloned repo: `cd ./MovieRama`

* Build Backend:
- `cd ./MovieRama-backend`
- `python3 -m venv env`
- `source env/bin/activate`
- `pip install -r requirements.txt`
- `python manage.py migrate`
- `python manage.py createsuperuser --username admin --email <sample_email_here>`

* At this point we continue with ElasticSearch setup (within `./MovieRama-backend` diresctory.
* Instructions for elasticsearch installation are here: https://www.elastic.co/guide/en/elasticsearch/reference/8.11/targz.html but for mac OS in short you can follow:
- `curl -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.4-darwin-x86_64.tar.gz`
- `curl https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.4-darwin-x86_64.tar.gz.sha512 | shasum -a 512 -c -`
- `tar -xzf elasticsearch-8.11.4-darwin-x86_64.tar.gz`

- In a new term again to our backend base dir(MovieRama-backend) and from there go to the newly created Elasticsearch dir `cd ./elasticsearch-8.11.4/` and run Elastic: `./bin/elasticsearch` , Once done you will see a password that Elasticsearch generates, export this to:

 in new term window:
- `export ELASTIC_PASSWORD="your_password"`
- `export ES_HOME="YOUR_BASE_PATH_TO_CLONED_REPO/MovieRama-backend/elasticsearch-8.11.4"`
- Verify installation is correct by running: `curl --cacert $ES_HOME/config/certs/http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200` this should produce a json with Elasticsearch conf info.

  
- Now for Django to use elasticsearch edit the settings file in: `MovieRama-backend/movierama/settings.py` (line 160)

```
ELASTICSEARCH_DSL={
    'default': {
        'hosts': 'https://localhost:9200',
        "http_auth": ("elastic", "YOUR_ELASTICSEARC_GENERATED_PASSWORD"),
        "ca_certs": "Place the PATH from the command: echo $ES_HOME/config/certs/http_ca.crt, for exmple mine is: /Users/georgepetrou/Desktop/MovieRama/MovieRama-backend/elasticsearch-8.11.4/config/certs/http_ca.crt",
    },
}
```

We are almost there!:  
In our first terminal where we left it, run:

- `python manage.py search_index --rebuild`
- `python manage.py runserver`

Now the backend should be up and running!

* Build Frontend, in a nw term, in cloned folder:
- `cd ../movie-app-frontend`
- `npm install`
- `ng serve`

Everything at this point should is up and running !!!
App is served in `http://localhost:4200/`

##

The project also uses a serveless component for a feature, that is deployed in cloudflare and the worker code in in wrangler project folder, no setup is required. Also, as a best practise for scaling, sorting is done in the backend and we also have pagination for our endpoints. I also have added logging and Logs are generated inside  `./MovieRama-backend` folder.

### I have also included a png file  (`Scalable_System_design`) with an 'ideal' scalable system design architecture using serverless architecture, also in `ScalableSystem_Explanation` you will find some explanation about the architecture design.

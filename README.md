# MovieRama
A Movie Platform (2024)

## _Tech Stack_ 

* Python
* Django & Django-Rest Framework  
* Django jwt Auth
* SQLite3
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

* At this point we continue with ElasticSearch setup (within `./MovieRama-backend` diresctory. If you wish to skip this step, you can but once testing the app using the search bar will lead to errors (so you can skip using the search bar functionality).
* Instructions for elasticsearch installation are here: https://www.elastic.co/guide/en/elasticsearch/reference/8.11/targz.html but for mac OS in short you can follow:
- `curl -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.4-darwin-x86_64.tar.gz`
- `url https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.4-darwin-x86_64.tar.gz.sha512 | shasum -a 512 -c -`
- `tar -xzf elasticsearch-8.11.4-darwin-x86_64.tar.gz`
-
-  In a new term again to our backend base dir(MovieRama-backend) and from there go to the newly created Elasticsearch dir `cd ./elasticsearch-8.11.4/` and run Elastic: `./bin/elasticsearch` , Once done this will see a password that Elasticsearch generates, export this to:
-  `export ELASTIC_PASSWORD="your_password"`
-  `export ES_HOME="YOUR_BASE_PATH_TO_CLONED_REPO/MovieRama/MovieRama-backend/elasticsearch-8.11.4"`
-  Verify installation is correct by running `curl --cacert $ES_HOME/config/certs/http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200` this should produce a json with Elasticsearch conf info.

We are almost there!: 

- `python manage.py search_index --rebuild`
- `python manage.py runserver`

Now the backend should be up and running!

* Build Frontend:
- `cd ../movie-app-frontend`
- `npm install`
- `ng serve`

Everything at this point should is up and running !!!
App is served in `http://localhost:4200/`

The project also uses a serveless component for a feature, that is deployed in cloudflare and the worker code in in wrangler project folder, no setup is required.

Logs are generated in `./MovieRama-backend` folder.


Due to luck of time this project does not include:
- ~~Sorting requirement is covered in frontend which we know is not ideal (but simpler)~~ (Done!)
- ~~Pagination would be nice to have (ideally woulbe be done on the backend and requires frontend handling as well)~~ (Done!)
- Unit tests
- Comments in code and documentation
- scaled db (not just an sqlite)
 ... as you can see the list of improvements is not exhaustive 🙂
Just mentioning those as in a real production project these would not be best practises if the app was scaling.
##

### I have also included a png file  (`Scalable_System_design`) with an 'ideal' scalable system design architecture using serverless architecture, also in `ScalableSystem_Explanation` you will find some explanation about teh architecture design.

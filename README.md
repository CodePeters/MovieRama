# MovieRama
A Movie Platform (2024)

## _Technology Stack_ 

* Python
* Django & Django-Rest Framework  
* Django jwt Auth
* SQLite3
* Angular 18
* Angular Material

## _Installation__
After git clone `cd` to the cloned repo: `cd ./MovieRama`

* Build Backend:
- `cd ./MovieRama-backend`
- `python3 -m venv env`
- `source env/bin/activate`
- `pip install djangorestframework`
- `pip install django-cors-headers`
- `python manage.py migrate`
- `python manage.py createsuperuser --username admin --email <sample_email_here>`
- `python manage.py runserver`

Now the backend should be up and running!

* Build Frontend:
- `cd ../movie-app-frontend`
- `npm install`
- `ng serve`

Everything at this point should is up and running !!!
App is served in `http://localhost:4200/`

Log is generated in `./MovieRama-backend` folder.


Due to luck of time this project does not include:
- Sorting requirement is covered in frontend which we know is not ideal (but simpler)
- Unit tests
- Pagination would be nice to have (ideally woulbe be done on the backend and requires frontend handling as well)


* I have also included a png file with a scalable system design using serverless architecture

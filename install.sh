#!/bin/bash
set -x
cd ./MovieRama-backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate

cd ../
curl -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.4-darwin-x86_64.tar.gz
curl https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.4-darwin-x86_64.tar.gz.sha512 | shasum -a 512 -c -
tar -xzf elasticsearch-8.11.4-darwin-x86_64.tar.gz

cd ./movie-app-frontend
npm install


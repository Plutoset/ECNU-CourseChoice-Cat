FROM python:3.9-slim-buster

EXPOSE 80

WORKDIR /app
COPY ./app .

RUN pip install requests Flask Flask-Caching gunicorn

CMD exec gunicorn --bind :80 --workers 1 --threads 4 --timeout 0 main:app

FROM python:3.6.9-slim-buster

WORKDIR /app
# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt .
COPY ./requirements/prod.txt ./requirements/
COPY ./requirements/dev.txt ./requirements/

RUN \
    apt-get update && apt-get install -y build-essential && apt-get install -y python3-pip

RUN pip3 install -r requirements.txt --no-cache-dir

#ENV FLASK_DEBUG=1
COPY . .
ENV FLASK_APP=autoapp.py
RUN pip3 list
RUN flask drop-db
RUN flask db init
RUN flask db migrate
RUN flask db upgrade
EXPOSE 5000

CMD ["gunicorn", "autoapp:app", "-b", "0.0.0.0:5000"]
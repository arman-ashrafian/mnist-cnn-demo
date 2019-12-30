FROM ubuntu:18.10

RUN apt-get update -y && \
    apt-get install -y python3 python3-pip python3-dev nginx

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN python3 -m pip install -r requirements.txt

COPY . /app

# expose port 80
EXPOSE 80

CMD [ "python3", "server.py" ]

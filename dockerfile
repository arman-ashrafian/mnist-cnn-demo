FROM continuumio/miniconda3:latest

WORKDIR /Users/aashrafian/workspace/mnist_app 

ADD requirements.txt ./

RUN python3 -m pip install -r requirements.txt

ADD . ./ 

EXPOSE 5000 

ENTRYPOINT ["python3", "server.py", "5000", "false"]

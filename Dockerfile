FROM balenalib/raspberrypi3-64-python:3.6.9

ENV INITSYSTEM on

RUN apt-get -y update
RUN apt-get -y dist-upgrade
RUN apt-get -y install python3 cron
RUN pip3 install python-crontab

COPY . .

RUN apt-get -y update
CMD ["python3", "init.py"]

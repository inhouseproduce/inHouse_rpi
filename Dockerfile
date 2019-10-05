FROM balenalib/raspberrypi4-64-python:3.6.9

ENV INITSYSTEM on

RUN apt-get -y update
RUN apt-get -y dist-upgrade
RUN apt-get -y install python3 rpi.gpio python-crontab cron

COPY . .

RUN apt-get -y update
CMD ["python3", "init.py"]

FROM balenalib/%%BALENA_MACHINE_NAME%%-python

ENV INITSYSTEM on

RUN apt-get -y update
RUN apt-get -y dist-upgrade
RUN apt-get -y install python3 rpi.gpio python-crontab cron

COPY . .

RUN apt-get -y update
RUN whoami
CMD ["python3", "init.py"]

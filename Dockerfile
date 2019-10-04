FROM balenalib/raspberrypi4-64-python

ENV INITSYSTEM on

RUN apt-get -y update
RUN apt-get -y dist-upgrade
RUN apt-get install python3.6 rpi.gpio



RUN apt-get -y update
CMD ["python3", "init.py"]

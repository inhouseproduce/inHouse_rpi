FROM balenalib/raspberrypi4-64-python

ENV INITSYSTEM on

RUN yum -y install wget

RUN apk add --no-cache \
    python3 gcc libc-dev parted-dev python3-dev

# install RPi.GPIO
RUN wget http://pypi.python.org/packages/source/R/RPi.GPIO/RPi.GPIO-0.7.0.tar.gz
RUN tar xvzf RPi.GPIO-0.7.0.tar.gz
RUN cd RPi.GPIO-0.7.0
RUN sudo python setup.py install
RUN cd ..
RUN sudo rm -rf RPi.GPIO-0.7.0
RUN sudo rm -rf RPi.GPIO-0.7.0.tar.gz


RUN apt-get -y update
CMD ["python3", "init.py"]

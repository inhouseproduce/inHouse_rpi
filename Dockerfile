FROM balenalib/raspberrypi4-64-python
RUN apt-get -y update
CMD ["python3", "init.py"]

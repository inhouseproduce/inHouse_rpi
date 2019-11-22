#!/bin/sh

sudo apt-get -y update
sudo apt-get -y dist-upgrade
sudo apt-get -y install rpi.gpio s3cmd python3-pip i2c-tools
pip3 install python-crontab
pip3 install smbus

python3 ~/inHouse_rpi/init.py
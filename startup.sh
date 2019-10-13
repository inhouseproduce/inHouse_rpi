#!/bin/sh

sudo apt-get -y update
sudo apt-get -y dist-upgrade
sudo apt-get -y install rpi.gpio
sudo apt-get -y install s3cmd
sudo apt-get -y install python3-pip
pip3 install python-crontab
pip3 install smbus

python3 ~/inHouse_rpi/set_cron.py
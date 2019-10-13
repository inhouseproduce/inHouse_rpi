#!/usr/bin/python3
import os

os.system("sudo apt-get -y update")
os.system("sudo apt-get -y dist-upgrade")
os.system("sudo apt-get -y install rpi.gpio")
os.system("sudo apt-get -y install s3cmd")
os.system("sudo apt-get -y install python3-pip")
os.system("pip3 install python-crontab")
os.system("pip3 install smbus")

os.system("python3 ~/inHouse_rpi/set_cron.py")
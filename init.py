#!/usr/bin/python3
import set_cron as set_cron
import os

os.system("sudo apt-get -y install s3cmd")
os.system("pip3 install smbus")
set_cron.main()
#!/usr/bin/python3
import set_cron as set_cron
import os

#install s3
os.system("sudo apt-get -y install s3cmd")
set_cron.main()
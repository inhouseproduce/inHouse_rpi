#!/usr/bin/python3
import set_cron as set_cron
import os

print('running init.py')
os.system('sudo crontab -u pi -r')
set_cron.main()
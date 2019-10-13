#!/usr/bin/python3
import set_cron as set_cron
import os

os.system('sudo crontab -u pi -r')
set_cron.main()
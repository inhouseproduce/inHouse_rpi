#!/usr/bin/python3
import os
import set_cron as set_cron

os.system('sudo crontab -u pi -r')
set_cron.main()
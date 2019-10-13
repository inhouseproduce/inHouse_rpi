#######################################################################################################################
# CronTab Configuration
# 
# Written by inHouse Produce. ONLY to be used by inHouse Produce.
#######################################################################################################################
# Set all scheduled cronjobs for the RaspberryPi
#######################################################################################################################
#!/usr/bin/python3
from crontab import CronTab
import os
import time

def main():
    pi_cron = CronTab(user='pi')
    pi_cron.env['MAILTO'] = 'andrin@inhouseproduce.com']

    # Check for new versions
    # update_git = pi_cron.new(command = 'cd /home/pi/inHouse_rpi/; bash update_git.sh')
    # update_git.minute.on(15,45)

    # Heat & Humidity
    heat_humid = pi_cron.new(command = 'python3 /home/pi/inHouse_rpi/heat_and_humidity.py')
    heat_humid.minute.every(1)

    pi_cron.write()

if __name__ == "__main__":
    main()

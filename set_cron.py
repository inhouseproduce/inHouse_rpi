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
    pi_cron.env['MAILTO'] = 'trevor@inhouseproduce.com'

    # Capture data and send to s3
    img_capture = pi_cron.new(command = 'python3 /home/pi/inHouse_rpi/img_capture.py')
    img_capture.minute.on(0,30)

    # Check for new versions
    update_git = pi_cron.new(command = 'cd /home/pi/inHouse_rpi/; bash update_git.sh')
    update_git.minute.on(15,45)

    # Run Main Pump
    main_pump = pi_cron.new(command = 'sleep 1 && python3 /home/pi/inHouse_rpi/main_pump.py')
    main_pump.every_reboot()

    # Run Germination Pump
    elongation_pump = pi_cron.new(command = 'sleep 1 && python3 /home/pi/inHouse_rpi/elongation_pump.py')
    elongation_pump.every_reboot()

    # Run Ozone
    ozone = pi_cron.new(command = 'sleep 1 && python3 /home/pi/inHouse_rpi/ozone.py')
    ozone.every_reboot()

    # Set Lights
    lights = pi_cron.new(command = 'sleep 1 && python3 /home/pi/inHouse_rpi/set_lights.py')
    lights.every_reboot()

    # Set Brightness
    brightness = pi_cron.new(command = 'sleep 2 && python3 /home/pi/inHouse_rpi/light_intensity.py')
    brightness.every_reboot()

    pi_cron.write()

if __name__ == "__main__":
    main()
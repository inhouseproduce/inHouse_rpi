#######################################################################################################################
# CronTab Configuration
# 
# Written by inHouse Produce. ONLY to be used by inHouse Produce.
#######################################################################################################################
# Set all scheduled cronjobs for the RaspberryPi
#######################################################################################################################
from crontab import CronTab

def main():
    pi_cron = CronTab(user='pi')
    pi_cron.env['MAILTO'] = 'andrin@inhouseproduce.com'

    # Capture data and send to s3
    img_capture = pi_cron.new(command = 'python3 /home/pi/inHouse_rpi/img_capture.py')
    img_capture.minute.on(0,30)

    # Check for new versions
    update_git = pi_cron.new(command = 'cd /home/pi/inHouse_rpi/; bash update_git.sh')
    update_git.minute.on(15,45)

    # Run Water Pump
    main_pump = pi_cron.new(command = 'python3 /home/pi/inHouse_rpi/run_water.py')
    main_pump.minute.every(6)

    # Set Lights
    lights = pi_cron.new(command = 'python3 /home/pi/inHouse_rpi/set_lights.py')
    lights.min.every(1)

    pi_cron.write()

if __name__ == "__main__":
    main()
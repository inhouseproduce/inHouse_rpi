#######################################################################################################################
# RaspberryPi Remote Camera Monitoring
# Test code taken from https://www.arducam.com/multi-camera-adapter-module-raspberry-pi/ and modified to requirements
# 
# Written by inHouse Produce. ONLY to be used by inHouse Produce.
#######################################################################################################################
# The following code uses an ArduCam header to multiplex four cameras at 30 minute intervals and sends 
# the received picture right to the Amazon S3 web server before deleting it locally
#######################################################################################################################
import RPi.GPIO as gp
import os
import time
import datetime
import configparser

import rpi_config as rpi_config
import climate as climate


######################################################
# setPins
# initialize power and data pins for each camera
######################################################
def setPins():
    gp.setup(7, gp.OUT) #Pin 7 needed for all cameras

    # Listed pins according to arducam adapter number
    # Camera #    1       2       3       4
    setup_pins = [11, 12, 15, 16, 21, 22, 23, 24]
    for pin in setup_pins:
        gp.setup(pin, gp.OUT)
        gp.output(pin, True)


######################################################
# cameraProcess
# take a photo for a given camera and push it to s3
######################################################
def cameraProcess(pathway):
    camera = PiCamera()
    camera.rotation = 270
    camera.start_preview()
    time.sleep(3) # >2 seconds of sleep time required for the camera to focus
    date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    camera.capture("/home/pi/inHouse_rpi/camera_%s.jpg" %date)
    camera.stop_preview()
    os.system('s3cmd put /home/pi/inHouse_rpi/camera_%s.jpg %s' %(date, pathway)) #push image to s3
    os.system('rm /home/pi/inHouse_rpi/camera_%s.jpg' %date) #delete image locally
    climate.main(date)


######################################################
# main
# initialize camera and send pictures from each
# source to s3 on regular intervals
######################################################
def main():
    gp.setwarnings(False) #set warnings OFF
    gp.setmode(gp.BOARD)

    setPins()
    config = configparser.ConfigParser()

    if not os.path.isfile('/home/pi/inHouse_rpi/ihp_config.ini'):
        rpi_config.main()

    config.read('/home/pi/inHouse_rpi/ihp_config.ini')
    pathways = config['pathways']

    capture_pins = {
        1: {7: False, 11: False, 12: True},
        2: {7: True, 11: False, 12: True},
        3: {7: False, 11: True, 12: False},
        4: {7: True, 11: True, 12: False}
    }

    for camera, pins in capture_pins.items():
        for pin, value in pins.items():
            gp.output(pin, value)
        cameraProcess(pathways[str(camera)])
        time.sleep(60)


if __name__ == "__main__":
    main()
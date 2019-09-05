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
from picamera import PiCamera

import rpi_config as rpi_config
import climate as climate


######################################################
# cameraProcess
# take a photo for a given camera and push it to s3
######################################################
def cameraProcess(cameraIP, stack_num, module_num):
    date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    filename = "camera_%s.jpg" %date
    os.system('curl -o {} http://{}/capture'.format(filename, cameraIP))
    
    pathway = pathway + filename
    cwd = '{}/{}'.format(os.getcwd(), filename)

    os.system('s3cmd put %s %s' %(cwd, pathway)) #push image to s3
    os.system('rm %s' %cwd) #delete image locally
    climate.main(date)


######################################################
# main
# initialize camera and send pictures from each
# source to s3 on regular intervals
######################################################
def main():
    gp.setwarnings(False) #set warnings OFF
    gp.setmode(gp.BOARD)

    config = configparser.ConfigParser()

    if not os.path.isfile('/home/pi/inHouse_rpi/config.json'):
        rpi_config.main()
    config.read('/home/pi/inHouse_rpi/config.json')

    sitename = config['site']
    sysname = config['system']
    stacks = config['stacks']

    for stacknum, stack in enumerate(stacks):
        for module_num, module in enumerate(stack):
            ip = module['host']
            pathway = "s3://inhouseproduce-sites/{}/{}/stack{}/module{}/".format(sitename, sysname, stack_num, module_num)
            cameraProcess(ip, pathway)
        time.sleep(60)


if __name__ == "__main__":
    main()
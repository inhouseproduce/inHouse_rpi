#######################################################################################################################
# RaspberryPi Remote Camera Monitoring
# Test code taken from https://www.arducam.com/multi-camera-adapter-module-raspberry-pi/ and modified to requirements
# 
# Written by inHouse Produce. ONLY to be used by inHouse Produce.
#######################################################################################################################
# The following code uses an ArduCam header to multiplex four cameras at 30 minute intervals and sends 
# the received picture right to the Amazon S3 web server before deleting it locally
#######################################################################################################################
#!/usr/bin/python3
import os
import time
import datetime
import json
import climate as climate


######################################################
# cameraProcess
# take a photo for a given camera and push it to s3
######################################################
def cameraProcess(cameraIP, pathway):
    date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    filename = "capture_%s.jpg" %date
    os.system('curl -o {} http://{}/capture'.format(filename, cameraIP))
    os.system('s3cmd put %s %s' %(filename, pathway + filename)) #push image to s3
    os.system('rm %s' %filename) #delete image locally
    try:
        climate.main(pathway, date)
    except:
        pass


######################################################
# main
# initialize camera and send pictures from each
# source to s3 on regular intervals
######################################################
def main():
    #reads the JSON file
    with open('/home/pi/inHouse_rpi/config.json') as config_file:
        config = json.load(config_file)

        sitename = config['site']
        sysname = config['system']

        #Iterate through stacks and modules for the IP address of camera images
        for stack_num, stack in enumerate(config['stacks']):
            for module_num, module in enumerate(stack['modules']):
                for camera_num, camera in enumerate(module['cameras']):
                    ip = camera['host']
                    if ip:
                        #pathway to s3
                        pathway = "s3://inhouseproduce-sites/{}/system{}/stack{}/module{}/camera{}/".format(sitename, sysname, stack_num+1, module_num+1, camera_num+1)
                        cameraProcess(ip, pathway)

if __name__ == "__main__":
    main()
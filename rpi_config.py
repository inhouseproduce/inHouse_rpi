#######################################################################################################################
# RaspberryPi Configuration
# 
# Written by inHouse Produce. ONLY to be used by inHouse Produce.
#######################################################################################################################
# Save configuration to ihp_config.ini
#######################################################################################################################
#!/usr/bin/python3
import configparser
import os


######################################################
# getPathways
# extract pathway name from s3
######################################################
def getPathways(config):
   pathways = {}
   f = open('/home/pi/inHouse_rpi/out.txt','r')
   config['pathways'] = {}
   pathways = config['pathways']
   lines = f.readlines()
   for idx,line in enumerate(lines):
        #following lines get the desired listing and strip the unnecessary string from the pathway
        if (idx == 0):
            config['climate'] = {'pathway': line[29:]} #29th character onwards gives the correct pathway
        if (line.find('Module1') >= 0):
            pathways['1'] = line[29:] 
        elif (line.find('Module2') >= 0):
            pathways['2'] = line[29:]
        elif (line.find('Module3') >= 0):
            pathways['3'] = line[29:]
        elif (line.find('Module4') >= 0):
            pathways['4'] = line[29:]


######################################################
# getSerial
# extract serial number of the Raspberry Pi
######################################################
def getSerial(config):
    serialfile = open('/proc/cpuinfo','r')
    for line in serialfile:
        if line[0:6]=='Serial':
            cpu_serial = line[10:26]
            serialfile.close()
            config['cpu_serial'] = {'cpu_serial': cpu_serial}

            return cpu_serial

    serialfile.close()
    raise Exception('no cpu_serial found')
    return False


######################################################
# main
# save path and serial data to ini file
######################################################
def main():
    pathways = {}
    config = configparser.ConfigParser()

    cpu_serial = getSerial(config)

    if (os.path.exists('/home/pi/inHouse_rpi/out.txt') == False):
        # if there is no output file created, a new one is generated with recursive listings 
        # associated with the Pi's serial number
        os.system('s3cmd ls -r s3://inhouseproduce-sites | grep "%s" > /home/pi/inHouse_rpi/out.txt' %cpu_serial)
    
    getPathways(config)

    with open('/home/pi/inHouse_rpi/ihp_config.ini', 'w') as configfile:
        config.write(configfile)
    

if __name__ == "__main__":
    main()
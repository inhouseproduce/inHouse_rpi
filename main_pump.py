#!/usr/bin/python3
from EmulatorGUI import GPIO as gp
import datetime
import time
import json

def run(now, pin, schedule):
    if now.minute % (schedule.data.on + schedule.data.off) < schedule.data.on:
        gp.output(pin, False)
    else:
        gp.output(pin, True)

#every 6 minutes for 1 minute and 10 seconds
def main():
    with open('/home/pi/inHouse_rpi/config.json') as config_file:
        schedule = json.load(config_file).scheduling.main_pump

        pin = 17
        gp.setmode(gp.BCM)
        gp.setup(pin, gp.OUT)
        while(True):
            now = datetime.datetime.now()
            run(now, pin, schedule)
            time.sleep(60)
    

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
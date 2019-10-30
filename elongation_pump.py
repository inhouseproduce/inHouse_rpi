#!/usr/bin/python3
from EmulatorGUI import GPIO as gp
import datetime
import time
import json

def run(now, pin, schedule):
    for trigger in schedule.data:
        if now.hour = datetime.datetime.strptime(trigger.on, "%H:%M").hour or trigger.on:
            if now.minute = datetime.datetime.strptime(trigger.on, "%H:%M").minute or 0:
                gp.output(pin, False)
            else:
                gp.output(pin, True)
        else: 
            gp.output(pin, True)

# every 4 hours for 5 minutes
def main():
    with open('/home/pi/inHouse_rpi/config.json') as config_file:
        schedule = json.load(config_file).scheduling.elongation_pump
        pin = 27
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
#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time
import controls

#every 6 minutes for 1 minute and 10 seconds
def main():
    pin = 17
    gp.setmode(gp.BCM)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()
    if now.minute % 6 == 0:
        gp.output(pin, False)
    else:
        gp.output(pin, True)

def trigger():
    main_pump.trigger()

def kill():
    main_pump.kill()

if __name__ == "__main__":
    main()
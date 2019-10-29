#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time

#every 6 minutes for 1 minute and 10 seconds
def main():
    pin = 17
    gp.setmode(gp.BCM)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    gp.output(pin, False)
    time.sleep(60)
    gp.output(pin, True)

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
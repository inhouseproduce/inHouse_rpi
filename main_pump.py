#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time

#every 6 minutes for 1 minute and 10 seconds
def main():
    pin = 17

    now = datetime.datetime.now()
    if now.minute % 6 == 0:
        gp.output(pin, False)
    else:
        gp.output(pin, True)

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
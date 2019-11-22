#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time


def run(now, pin):
    if now.hour == 0 or now.hour == 3 or now.hour == 6:
        gp.output(pin, False)
    else:
        gp.output(pin, True)

# every 4 hours for 5 minutes
def main():
    pin = 23
    gp.setmode(gp.BCM)
    gp.setup(pin, gp.OUT)

    while(True):
        now = datetime.datetime.now()
        run(now, pin)
        time.sleep(60)

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
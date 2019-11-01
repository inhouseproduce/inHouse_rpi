#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time

def run(now, pin):
    if now.minute % 5 == 0 and now.second < 29:
        gp.output(pin, False)
    else:
        gp.output(pin, True)

#every 6 minutes for 1 minute and 10 seconds
def main():
    pin = 17
    gp.setmode(gp.BCM)
    gp.setup(pin, gp.OUT)
    while(True):
        now = datetime.datetime.now()
        run(now, pin)
        time.sleep(30)
    
def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
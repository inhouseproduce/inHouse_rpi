#!/usr/bin/python3
import RPi.GPIO as gp
import datetime


def run(now):
    if now.hour % 4 == 0 and now.minute < 5:
        gp.output(pin, False)
    else:
        gp.output(pin, True)

# every 4 hours for 5 minutes
def main():
    pin = 27
    gp.setmode(gp.BCM)
    gp.setup(pin, gp.OUT)
    while(True):
        now = datetime.datetime.now()
        run(now)
        time.sleep(60)

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
#!/usr/bin/python3
import RPi.GPIO as gp
import datetime

# every 4 hours for 5 minutes
def main():
    pin = 27

    now = datetime.datetime.now()
    if now.hour % 4 == 0 and now.minute < 5:
        gp.output(pin, False)
    else:
        gp.output(pin, True)

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
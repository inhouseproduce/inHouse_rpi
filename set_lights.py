#!/usr/bin/python3
import RPi.GPIO as gp
import datetime

import light_intensity


def main():
    pin = 4
    gp.setmode(gp.BCM)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()

    # Off between 10pm and 6am
    if now.hour >= 6 and now.hour < 22:
        gp.output(pin, True)
    else:
        gp.output(pin, False)

def trigger():
    gp.output(pin, True)

def kill():
    gp.output(pin, False)

if __name__ == "__main__":
    main()
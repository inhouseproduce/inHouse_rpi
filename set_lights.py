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

    # Off between 2am and 10am
    if now.hour >= 0 and now.hour < 8:
        gp.output(pin, False)
    # will later implement dimming from 6PM - 12PM
    else:
        gp.output(pin, True)

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()
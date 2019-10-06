#!/usr/bin/python3
import RPi.GPIO as gp
import datetime


def main():
    pin = 7
    gp.setmode(gp.BOARD)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()
    if now.hour >= 6 and now.hour < 22:
        gp.output(pin, False) # no voltage defaults to connected
    else:
        gp.output(pin, True)
        

if __name__ == "__main__":
    main()
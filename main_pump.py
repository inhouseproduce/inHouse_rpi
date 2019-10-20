#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time

#every 6 minutes for 1 minute and 10 seconds
def main():
    pin = 11
    gp.setmode(gp.BOARD)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()
    if now.minute % 6 == 0:
        gp.output(pin, False)
    elif now.minute % 6 == 1:
        gp.output(pin, False)
        time.sleep(10)
        gp.output(pin, True)
    else:
        gp.output(pin, True)

if __name__ == "__main__":
    main()
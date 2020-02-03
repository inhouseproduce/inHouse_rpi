#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time

def run(now, pin):
    # Off between 10pm and 6am
    if now.hour >= 6 and now.hour < 22:
        gp.output(pin, False)
        if now.hour >= 18:
            set_brightness('25')
        else:
            set_brightness('100')
    else:
        gp.output(pin, True)

# every 4 hours for 5 minutes
def main():
    pin = 22
    gp.setmode(gp.BCM)
    gp.setup(pin, gp.OUT)
    while(True):
        now = datetime.datetime.now()
        run(now, pin)
        time.sleep(60)


def set_brightness(value):
    brightness_path = "/home/pi/inHouse_rpi/brightness.lvl"
    with open('%s' %brightness_path, 'w') as brightness_file:
        brightness_file.write(value)

def trigger():
    gp.output(pin, False)

def kill():
    gp.output(pin, True)

if __name__ == "__main__":
    main()

#!/usr/bin/python3
import RPi.GPIO as gp
import datetime

def main():
    pin = 4
    gp.setmode(gp.BCM)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()

    # Off between 10pm and 6am
    if now.hour >= 6 and now.hour < 22:
        gp.output(pin, True)
        if now.hour >= 17:
            set_brightness('25')
        else:
            set_brightness('100')
    else:
        gp.output(pin, False)


def set_brightness(value):
    brightness_path = "/home/pi/inHouse_rpi/brightness.lvl"
    with open('%s' %brightness_path, 'w') as brightness_file:
        brightness_file.write(value)

def trigger():
    gp.output(pin, True)

def kill():
    gp.output(pin, False)

if __name__ == "__main__":
    main()

#!/usr/bin/python3
import RPi.GPIO as gp
import datetime

def main():
    pin = 4
    gp.setmode(gp.BCM)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()

    # Off between 2am and 10am
    if now.hour > 8:
        gp.output(pin, True)
        if now.hour >= 18:
            set_brightness(50)
        else:
            set_brightness(100)
    else:
        gp.output(pin, False)


def set_brightness(value):
    brightness_path = "~/inHouse_rpi/brightness.lvl"
    with open('%s' %brightness_path, 'w') as brightness_file:
        brightness_file.write(value)

def trigger():
    gp.output(pin, True)

def kill():
    gp.output(pin, False)


if __name__ == "__main__":
    main()
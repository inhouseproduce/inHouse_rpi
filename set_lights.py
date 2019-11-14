#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time

def run(now, pin):
    # On between 10am and 2am
    if now.hour >= 10 or now.hour < 2:
        gp.output(pin, True)
        
        if now.hour >= 18:
            set_brightness('50')
        else:
            set_brightness('100')
    else:
        gp.output(pin, False)

def main():
    pin = 4
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
    gp.output(pin, True)

def kill():
    gp.output(pin, False)

if __name__ == "__main__":
    main()
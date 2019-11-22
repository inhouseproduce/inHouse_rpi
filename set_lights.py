#!/usr/bin/python3
import RPi.GPIO as gp
import datetime
import time

def run(now, pin):
    # On between 9am and 1am - Normally open relay wiring
    if now.hour >= 9 or now.hour < 1:
        gp.output(pin, False)
        
        if now.hour >= 18:
            set_brightness('40')
        else:
            set_brightness('100')
    else:
        gp.output(pin, True)

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
    gp.output(pin, True)

def kill():
    gp.output(pin, False)

if __name__ == "__main__":
    main()

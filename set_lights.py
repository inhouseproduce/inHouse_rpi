#!/usr/bin/python3
import RPi.GPIO as gp
import datetime

def run(now, pin):
    # On between 10am and 2am
    if now.hour >= 10 or now.hour < 2:
        if gp.input(pin) == False:
            gp.output(pin, True)
        if now.hour >= 18:
            if get_brightness() != '30':
                set_brightness('30')
        else:
            set_brightness('100')
    else:
        gp.output(pin, False)

# every 4 hours for 5 minutes
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

def get_brightness():
    brightness_path = "/home/pi/inHouse_rpi/brightness.lvl"
    with open('%s' %brightness_path, 'w') as brightness_file:
        return brightness_file.read()

def trigger():
    gp.output(pin, True)

def kill():
    gp.output(pin, False)

if __name__ == "__main__":
    main()
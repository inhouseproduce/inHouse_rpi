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
    if now.hour >= 6 and now.hour < 22:
        gp.output(pin, True) # signal results in default
        if now.hour == 6:
            light_intensity.set_duty_cycle((now.minute / 60) * 100 )
            # light_intensity.warm_up(60 * 60 * 24)
        elif now.hour == 21 and now.minute == 0:
            light_intensity.set_duty_cycle(100 - (now.minute / 60) * 100 )
            # light_intensity.cool_down(60 * 60 * 24)
    else:
        gp.output(pin, False)
    
def trigger():
    gp.output(pin, True)

def kill():
    gp.output(pin, False)

if __name__ == "__main__":
    main()
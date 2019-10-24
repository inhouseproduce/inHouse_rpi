import RPi.GPIO as gp
import time
from os import path, system

def setup():
    gp.setwarnings(False)
    gp.setmode(gp.BCM)
    gp.setup(21,gp.OUT)
    pwm = gp.PWM(21,100)
    pwm.start(0)
    return pwm

def access_brightness():
    brightness_path = "/home/pi/inHouse_rpi/brightness.lvl"
    if(path.exists(brightness_path)):
        with open(brightness_path) as brightness_file:
            brightness = brightness_file.read()
            pwm.ChangeDutyCycle(brightness)

def main():
    pwm = setup()
    while(True):
        access_brightness()

if __name__ == "__main__":
    main()
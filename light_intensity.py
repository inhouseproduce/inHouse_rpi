import RPi.GPIO as gp
import time
from os import path, system

def setup():
    pin = 21
    pwm = gp.PWM(pin,1000)
    pwm.start(0)
    return pwm

def access_brightness(pwm, last_level):
    brightness_path = "/home/pi/inHouse_rpi/brightness.lvl"
    if(path.exists(brightness_path)):
        with open(brightness_path) as brightness_file:
            try:
                brightness = int(brightness_file.read())
            except:
                print("fail!")
                brightness = 100
                pwm.ChangeDutyCycle(brightness)
                return brightness
            else:
                if (brightness != last_level):
                    print("set brightness to : ",brightness)
                    pwm.ChangeDutyCycle(brightness)
                    return brightness
                else:
                    print("brightness maintained at: ",last_level)
                    return last_level

def main():
    pwm = setup()
    last_level = 0
    while(True):

        last_level = access_brightness(pwm, last_level)
        time.sleep(60)

if __name__ == "__main__":
    main()

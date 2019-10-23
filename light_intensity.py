import RPi.GPIO as gp
import time

def setup():
    gp.setwarnings(False)
    gp.setmode(gp.BCM)
    gp.setup(21,gp.OUT)
    pwm = gp.PWM(21,100)
    pwm.start(0)
    return pwm

def maintain():
    pwm = setup()
    pwm.ChangeDutyCycle(100)

    while(True):
        time.sleep(60)

def set_duty_cycle(percent):
    
    p.ChangeDutyCycle(percent)
    
import RPi.GPIO as gp
import time

gp.setwarnings(False)
gp.setmode(IO.BCM)
gp.setup(21,IO.OUT)
p = IO.PWM(21,100)
p.start(0)


def cool_down(interval):
    for x in range (100):
        p.ChangeDutyCycle(100-x)
        time.sleep(interva/100)

def warm_up(interval):
    for x in range (100):
        p.ChangeDutyCycle(x)
        time.sleep(interval/100)

def set_duty_cycle(percent):
    p.ChangeDutyCycle(percent)
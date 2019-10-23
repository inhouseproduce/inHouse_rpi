import RPi.GPIO as gp
import time

# gp.setwarnings(False)
# gp.setmode(gp.BCM)
# gp.setup(21,gp.OUT)
# p = gp.PWM(21,100)
# p.start(0)


# def cool_down(interval):
#     for x in range (100):
#         p.ChangeDutyCycle(100-x)
#         time.sleep(interva/100)

# def warm_up(interval):
#     for x in range (100):
#         p.ChangeDutyCycle(x)
#         time.sleep(interval/100)

def set_duty_cycle(percent):
    gp.setwarnings(False)
    gp.setmode(gp.BCM)
    gp.setup(21,gp.OUT)
    p = gp.PWM(21,100)
    p.start(0)
    p.ChangeDutyCycle(percent)
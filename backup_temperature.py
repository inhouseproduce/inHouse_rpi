import RPi.GPIO as gp

def main():
    pin = 12
    gp.setmode(gp.BOARD)
    gp.setwarnings(False)
    gp.setup(pin, gp.IN)


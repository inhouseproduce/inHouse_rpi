import RPi.GPIO as gp
import time


def main():
    pin = 11
    runtime = 60 # 1 minute
    gp.setmode(gp.BOARD)
    gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    gp.output(pin, True)
    time.sleep(runtime)
    gp.output(pin, False)

if __name__ == "__main__":
    main()
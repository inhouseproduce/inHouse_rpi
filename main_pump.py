import RPi.GPIO as gp
import datetime

#every 6 minutes for 1 minute
def main():
    pin = 11
    gp.setmode(gp.BOARD)
    # gp.setwarnings(False)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()
    if now.minute % 6 == 0:
        gp.output(pin, True)
    else:
        gp.output(pin, False)

if __name__ == "__main__":
    main()
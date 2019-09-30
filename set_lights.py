import RPi.GPIO as gp


def main():
    pin = 11
    gp.setmode(gp.BOARD)
    gp.setup(pin, gp.OUT)
    if GPIO.input(pin):
        gp.output(pin, False)
    else:
        gp.output(pin, True)

if __name__ == "__main__":
    main()
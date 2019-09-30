import RPi.GPIO as gp
import datetime


def main():
    pin = 7
    gp.setmode(gp.BOARD)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()
    today6am = now.replace(hour=6, minute=0, second=0, microsecond=0)
    today10pm = now.replace(hour=22, minute=0, second=0, microsecond=0)
    if now >= today8am and now < today10pm:
        gp.output(pin, True)
    else:
        gp.output(pin, False)
        

if __name__ == "__main__":
    main()
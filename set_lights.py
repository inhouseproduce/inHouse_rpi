import RPi.GPIO as gp
import datetime


def main():
    pin = 7
    gp.setmode(gp.BOARD)
    gp.setup(pin, gp.OUT)

    now = datetime.datetime.now()
    today6am = now.replace(hour=6, minute=0, second=0, microsecond=0)
    today10pm = now.replace(hour=22, minute=0, second=0, microsecond=0)
    print('now: ',now)
    print('today6am: ',today6am)
    print('today10pm: ',today10pm)
    print('now >= today6am: ',now >= today6am)
    print('now < today10pm: ',now < today10pm)
    if now >= today6am and now < today10pm:
        gp.output(pin, False)
        print(gp.input(pin))
        print('lights should be on!')
    else:
        gp.output(pin, True)
        print(gp.input(pin))
        print('lights should be off!')
        

if __name__ == "__main__":
    main()
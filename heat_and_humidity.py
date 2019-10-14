#!/usr/bin/python3
import RPi.GPIO as gp
import climate as climate
import backup_temperature as backup
import datetime


def setHeat(temp, ideal, pin):
    if temp < ideal:
        gp.output(pin, False)
    else:
        gp.output(pin, True)


def setHumid(humidity, ideal, pin):
    if humidity < ideal:
        gp.output(pin, False)
    else:
        gp.output(pin, True)


def setPin(pin):
    gp.setup(pin, gp.OUT)


def main():
    gp.setmode(gp.BOARD)
    gp.setwarnings(False)

    idealTemp = 73
    idealHumid = 97

    heatPin = 11
    humidPin = 13
    
    setPin(heatPin)
    setPin(humidPin)

    cTemp = 0
    fTemp = 0 
    humidity = 0

    try:
        cTemp, fTemp, humidity = climate.get_climate()
    except:
        print("climate failed")
        try: 
            temp = climate.get_backup_temperature()
            raise NotImplementedError("not implemented yet!")
        except:
            print("backup temp failed")
            now = datetime.datetime.now()
            if now.minute <= 1:
                setHumid(0, idealHumid, humidPin)
            else:
                setHumid(100, idealHumid, humidPin)
        else:
            print('backup temp: ',temp)
            setHeat(temp, idealTemp, heatPin)
            
    else:
        setHeat(fTemp, idealTemp, heatPin)
        setHumid(humidity, idealHumid, humidPin)

if __name__ == "__main__":
    main()